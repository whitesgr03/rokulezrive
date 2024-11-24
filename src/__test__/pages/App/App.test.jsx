import { expect, describe, it, vi, beforeAll } from 'vitest';
import {
	render,
	screen,
	waitForElementToBeRemoved,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { RouterProvider, createMemoryRouter } from 'react-router-dom';
import { Context as ResponsiveContext } from 'react-responsive';
import { supabase } from '../../../utils/supabase_client';

import { Header } from '../../../components/layout/Header/Header';
import { Footer } from '../../../components/layout/Footer/Footer';
import { Navbar } from '../../../components/layout/Navbar/Navbar';
import { App } from '../../../components/pages/App/App';

vi.mock('../../../utils/supabase_client');
vi.mock('../../../components/layout/Header/Header');
vi.mock('../../../components/layout/Footer/Footer');
vi.mock('../../../components/layout/Navbar/Navbar');

describe('App component', () => {
	beforeAll(() => {
		const noop = () => {};
		Object.defineProperty(window, 'scrollTo', { value: noop, writable: true });
	});
	it('should render dark theme if browser prefers color scheme is dark or localstorage is set dark theme.', async () => {
		supabase.auth.getSession.mockResolvedValueOnce({
			data: {
				session: null,
			},
		});

		const localstorage = {
			setItem: vi.spyOn(Storage.prototype, 'setItem').mockReturnValueOnce(null),
			getItem: vi.spyOn(Storage.prototype, 'getItem').mockReturnValueOnce(null),
		};

		const mockMatches = true;

		const mockMatchMedia = vi.fn().mockReturnValueOnce({
			matches: mockMatches,
		});

		Object.defineProperty(window, 'matchMedia', {
			value: mockMatchMedia,
		});

		const router = createMemoryRouter([
			{
				path: '/',
				element: <App />,
			},
		]);

		render(<RouterProvider router={router} />);

		const appElement = await screen.findByTestId('app');

		expect(appElement).toHaveClass(/dark/);
		expect(localstorage.getItem).toBeCalledWith('darkTheme');
		expect(localstorage.setItem).toBeCalledWith('darkTheme', mockMatches);
		expect(mockMatchMedia).toBeCalledWith('(prefers-color-scheme: dark)');
	});
	it(`should not stored the user id if user is authenticated but in the 'account/resetting-password' path.`, async () => {
		supabase.auth.getSession.mockResolvedValueOnce({
			data: {
				session: { session: true },
			},
		});

		Object.defineProperty(window, 'matchMedia', {
			value: () => ({
				matches: false,
			}),
		});

		Header.mockImplementation(({ isLogin }) => (
			<p data-testid="header component">
				{isLogin ? 'User is logged in' : 'User is not logged in'}
			</p>
		));

		const router = createMemoryRouter(
			[
				{
					path: '/account/resetting-password',
					element: <App />,
				},
			],
			{ initialEntries: ['/account/resetting-password'] },
		);

		render(<RouterProvider router={router} />);

		const headerComponent = await screen.findByTestId('header component');

		expect(headerComponent).toHaveTextContent('User is not logged in');
	});
	it('should update user and logged out user if the user has ever reset password is incomplete.', async () => {
		supabase.auth.getSession.mockResolvedValueOnce({
			data: {
				session: {
					user: { user_metadata: { resetPassword: true } },
				},
			},
		});

		Object.defineProperty(window, 'matchMedia', {
			value: () => ({
				matches: false,
			}),
		});

		Header.mockImplementation(({ isLogin }) => (
			<p data-testid="header component">
				{isLogin ? 'User is logged in' : 'User is not logged in'}
			</p>
		));

		supabase.auth.updateUser.mockResolvedValueOnce();
		supabase.auth.signOut.mockResolvedValueOnce();

		const router = createMemoryRouter([
			{
				path: '/',
				element: <App />,
			},
		]);

		render(<RouterProvider router={router} />);

		await waitForElementToBeRemoved(() => screen.getByText(/loading/i));

		expect(supabase.auth.updateUser).toBeCalledTimes(1);
		expect(supabase.auth.signOut).toBeCalledTimes(1);
	});
	it(`should navigate to 'drive' path if the user is authenticated and not in the public file and error paths.`, async () => {
		supabase.auth.getSession.mockResolvedValueOnce({
			data: {
				session: {
					user: { id: '1', user_metadata: { resetPassword: false } },
				},
			},
		});

		Object.defineProperty(window, 'matchMedia', {
			value: () => ({
				matches: false,
			}),
		});

		supabase.auth.updateUser.mockResolvedValueOnce();
		supabase.auth.signOut.mockResolvedValueOnce();

		const router = createMemoryRouter([
			{
				path: '/',
				element: <App />,
			},
			{
				path: '/drive',
				element: <p>Drive page</p>,
			},
		]);

		render(<RouterProvider router={router} />);

		const drivePage = await screen.findByText('Drive page');

		expect(drivePage).toBeInTheDocument();
	});
	it(`should render active-mobile-nav class and navbar component if the user is authenticated and user's device screen is smaller than 700 pixels.`, async () => {
		supabase.auth.getSession.mockResolvedValueOnce({
			data: {
				session: {
					user: { id: '1', user_metadata: { resetPassword: false } },
				},
			},
		});

		Object.defineProperty(window, 'matchMedia', {
			value: () => ({
				matches: false,
			}),
		});

		supabase.auth.updateUser.mockResolvedValueOnce();
		supabase.auth.signOut.mockResolvedValueOnce();

		Navbar.mockImplementation(() => <p>Navbar component</p>);

		const router = createMemoryRouter([
			{
				path: '/',
				element: (
					<ResponsiveContext.Provider value={{ width: 600 }}>
						<App />
					</ResponsiveContext.Provider>
				),
				children: [
					{
						path: 'drive',
						element: <></>,
					},
				],
			},
		]);

		render(<RouterProvider router={router} />);

		await waitForElementToBeRemoved(() => screen.getByText(/loading/i));

		const appElement = screen.getByTestId('app');
		const navbarComponent = screen.getByText('Navbar component');

		expect(appElement).toHaveClass(/active-mobile-nav/);
		expect(navbarComponent).toBeInTheDocument();
	});
	it(`should render Footer component if the user's device screen is smaller than 700 pixels.`, async () => {
		supabase.auth.getSession.mockResolvedValueOnce({
			data: {
				session: null,
			},
		});

		Object.defineProperty(window, 'matchMedia', {
			value: () => ({
				matches: false,
			}),
		});

		Footer.mockImplementation(() => <p>Footer component</p>);

		const router = createMemoryRouter([
			{
				path: '/',
				element: (
					<ResponsiveContext.Provider value={{ width: 600 }}>
						<App />
					</ResponsiveContext.Provider>
				),
			},
		]);

		render(<RouterProvider router={router} />);

		await waitForElementToBeRemoved(() => screen.getByText(/loading/i));

		const footerComponent = screen.getByText('Footer component');

		expect(footerComponent).toBeInTheDocument();
	});
	it(`should render Modal component if modal is activated.`, async () => {
		const user = userEvent.setup();
		supabase.auth.getSession.mockResolvedValueOnce({
			data: {
				session: {
					user: { id: '1', user_metadata: { resetPassword: false } },
				},
			},
		});

		Object.defineProperty(window, 'matchMedia', {
			value: () => ({
				matches: false,
			}),
		});

		supabase.auth.updateUser.mockResolvedValueOnce();
		supabase.auth.signOut.mockResolvedValueOnce();

		const mockModalContent = {
			component: 'Modal component',
		};

		Navbar.mockImplementation(({ onActiveModal }) => (
			<button onClick={() => onActiveModal(mockModalContent)}>
				Navbar modal button
			</button>
		));

		const router = createMemoryRouter([
			{
				path: '/',
				element: (
					<ResponsiveContext.Provider value={{ width: 600 }}>
						<App />
					</ResponsiveContext.Provider>
				),
				children: [
					{
						path: 'drive',
						element: <></>,
					},
				],
			},
		]);

		render(<RouterProvider router={router} />);

		await waitForElementToBeRemoved(() => screen.getByText(/loading/i));

		const navbarButton = screen.getByRole('button', {
			name: 'Navbar modal button',
		});

		await user.click(navbarButton);

		const modal = screen.getByText('Modal component');

		expect(modal).toBeInTheDocument();
	});
	it(`should close menu if "handleCloseMenu" is executed or passing nothing to "handleActiveMenu".`, async () => {
		const user = userEvent.setup();
		supabase.auth.getSession.mockResolvedValueOnce({
			data: {
				session: {
					user: { id: '1', user_metadata: { resetPassword: false } },
				},
			},
		});

		Object.defineProperty(window, 'matchMedia', {
			value: () => ({
				matches: false,
			}),
		});

		supabase.auth.updateUser.mockResolvedValueOnce();
		supabase.auth.signOut.mockResolvedValueOnce();

		const mockMenu = {
			id: '1',
			button: 'test',
			name: 'test menu',
		};

		Navbar.mockImplementation(({ menu, onActiveMenu }) => (
			<>
				<button onClick={() => onActiveMenu(mockMenu)}>
					Navbar menu button
				</button>
				<p>{menu.name}</p>
			</>
		));

		Header.mockImplementation(({ onActiveMenu }) => (
			<>
				<button data-button="test">Header button</button>
				<button onClick={() => onActiveMenu()}>Close menu button</button>
			</>
		));

		const router = createMemoryRouter([
			{
				path: '/',
				element: (
					<ResponsiveContext.Provider value={{ width: 600 }}>
						<App />
					</ResponsiveContext.Provider>
				),
				children: [
					{
						path: 'drive',
						element: <></>,
					},
				],
			},
		]);

		render(<RouterProvider router={router} />);

		await waitForElementToBeRemoved(() => screen.getByText(/loading/i));

		const navbarButton = screen.getByRole('button', {
			name: 'Navbar menu button',
		});

		const appElement = screen.getByTestId('app');
		const headerButton = screen.getByRole('button', {
			name: 'Header button',
		});

		const closeMenuButton = screen.getByRole('button', {
			name: 'Close menu button',
		});

		await user.click(navbarButton);

		expect(screen.queryByText(mockMenu.name)).not.toBeNull();

		await user.click(appElement);

		expect(screen.queryByText(mockMenu.name)).toBeNull();

		await user.click(navbarButton);

		expect(screen.queryByText(mockMenu.name)).not.toBeNull();

		await user.click(headerButton);

		expect(screen.queryByText(mockMenu.name)).toBeNull();

		await user.click(navbarButton);

		expect(screen.queryByText(mockMenu.name)).not.toBeNull();

		await user.click(closeMenuButton);

		expect(screen.queryByText(mockMenu.name)).toBeNull();
	});
	it(`should switch color theme if "handleSwitchColorTheme" is executed.`, async () => {
		const user = userEvent.setup();
		supabase.auth.getSession.mockResolvedValueOnce({
			data: {
				session: { session: true },
			},
		});

		const localstorage = {
			setItem: vi.spyOn(Storage.prototype, 'setItem').mockReturnValueOnce(null),
			getItem: vi.spyOn(Storage.prototype, 'getItem').mockReturnValueOnce(null),
		};

		const isDarkTheme = false;

		Object.defineProperty(window, 'matchMedia', {
			value: () => ({
				matches: isDarkTheme,
			}),
		});

		Header.mockImplementation(({ darkTheme, onSwitchColorTheme }) => (
			<>
				<button onClick={onSwitchColorTheme}>Header button</button>
				<p>{darkTheme ? 'dark mode' : 'light mode'}</p>
			</>
		));

		const router = createMemoryRouter(
			[
				{
					path: '/account/resetting-password',
					element: <App />,
				},
			],
			{ initialEntries: ['/account/resetting-password'] },
		);

		render(<RouterProvider router={router} />);

		const headerButton = await screen.findByRole('button', {
			name: 'Header button',
		});

		const lightTheme = screen.getByText('light mode');

		expect(lightTheme).toBeInTheDocument();

		await user.click(headerButton);

		const darkTheme = screen.getByText('dark mode');

		expect(darkTheme).toBeInTheDocument();
		expect(localstorage.setItem).toBeCalledWith(
			'darkTheme',
			JSON.stringify(!isDarkTheme),
		);
	});
});
