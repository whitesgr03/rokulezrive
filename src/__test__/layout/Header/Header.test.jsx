import { expect, describe, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { RouterProvider, createMemoryRouter } from 'react-router-dom';
import { supabase } from '../../../utils/supabase_client';
import { Context as ResponsiveContext } from 'react-responsive';

import { Header } from '../../../components/layout/Header/Header';

vi.mock('../../../utils/supabase_client');

describe('Header component', () => {
	it(`should switch color themes if the user's device screen is smaller than 440 pixels and clicks the toggle button.`, async () => {
		const user = userEvent.setup();

		const mockProps = {
			onSwitchColorTheme: vi.fn(),
			onActiveMenu: vi.fn(),
		};

		const router = createMemoryRouter([
			{
				path: '/',
				element: (
					<ResponsiveContext.Provider value={{ width: 400 }}>
						<Header {...mockProps} />
					</ResponsiveContext.Provider>
				),
			},
		]);

		render(<RouterProvider router={router} />);

		const button = screen.getByRole('button', { name: 'Light mode' });

		await user.click(button);

		expect(mockProps.onSwitchColorTheme).toHaveBeenCalledTimes(1);
	});
	it(`should switch color themes if the user's device screen is wider than 440 pixels and clicks the toggle button.`, async () => {
		const user = userEvent.setup();

		const mockProps = {
			onSwitchColorTheme: vi.fn(),
		};

		const router = createMemoryRouter([
			{
				path: '/',
				element: (
					<ResponsiveContext.Provider value={{ width: 440 }}>
						<Header {...mockProps} />{' '}
					</ResponsiveContext.Provider>
				),
			},
		]);

		render(<RouterProvider router={router} />);

		const button = screen.getByTestId('feature-button');

		await user.click(button);

		expect(mockProps.onSwitchColorTheme).toHaveBeenCalledTimes(1);
	});
	it(`should render a logo text when the user's device screen is wider than 700 pixels.`, () => {
		const router = createMemoryRouter([
			{
				path: '/',
				element: (
					<ResponsiveContext.Provider value={{ width: 700 }}>
						<Header />
					</ResponsiveContext.Provider>
				),
			},
		]);

		render(<RouterProvider router={router} />);

		const element = screen.getByRole('heading', { name: 'Rokulezrive' });

		expect(element).toBeInTheDocument();
	});
	it(`should render "dropdown-slide-in" class name on dropdown list if "dropdownSlideIn" prop is provided`, () => {
		const mockProps = {
			dropdownSlideIn: true,
		};

		const router = createMemoryRouter([
			{
				path: '/',
				element: <Header {...mockProps} />,
			},
		]);

		render(<RouterProvider router={router} />);

		const element = screen.getByTestId('dropdown');

		expect(element).toHaveClass(/dropdown-slide-in/);
	});
	it(`should render a logout button and a logo link with "/drive" path when the user is authenticated`, () => {
		const mockProps = {
			isLogin: true,
		};

		const router = createMemoryRouter([
			{
				path: '/',
				element: <Header {...mockProps} />,
			},
		]);

		render(<RouterProvider router={router} />);

		const link = screen.getByRole('link', { name: 'Logo' });
		const button = screen.getByRole('button', { name: 'Logout' });

		expect(link).toHaveAttribute('href', '/drive');
		expect(button).toBeInTheDocument();
	});
	it(`should render a login link and a logo link with "/" path when the user is not authenticated`, () => {
		const mockProps = {
			isLogin: false,
		};

		const router = createMemoryRouter([
			{
				path: '/',
				element: <Header {...mockProps} />,
			},
		]);

		render(<RouterProvider router={router} />);

		const link = screen.getByRole('link', { name: 'Logo' });
		const button = screen.getByRole('link', { name: 'Login' });

		expect(link).toHaveAttribute('href', '/');
		expect(button).toBeInTheDocument();
	});
	it(`should render the "Dark mode" text if darkTheme prop is provided and user's device screen is smaller than 440 pixels`, () => {
		const mockProps = {
			darkTheme: true,
		};

		const router = createMemoryRouter([
			{
				path: '/',
				element: (
					<ResponsiveContext.Provider value={{ width: 400 }}>
						<Header {...mockProps} />
					</ResponsiveContext.Provider>
				),
			},
		]);

		render(<RouterProvider router={router} />);

		const button = screen.getByRole('button', { name: 'Dark mode' });

		expect(button).toBeInTheDocument();
	});
	it(`should render the "Light mode" text if darkTheme prop is not provided and user's device screen  is smaller than 440 pixels`, () => {
		const mockProps = {
			darkTheme: false,
		};

		const router = createMemoryRouter([
			{
				path: '/',
				element: (
					<ResponsiveContext.Provider value={{ width: 400 }}>
						<Header {...mockProps} />
					</ResponsiveContext.Provider>
				),
			},
		]);

		render(<RouterProvider router={router} />);

		const button = screen.getByRole('button', { name: 'Light mode' });

		expect(button).toBeInTheDocument();
	});
	it(`should render the moon icon if darkTheme prop is provided and user's device screen is wider than 440 pixels.`, () => {
		const mockProps = {
			darkTheme: true,
		};

		const router = createMemoryRouter([
			{
				path: '/',
				element: (
					<ResponsiveContext.Provider value={{ width: 440 }}>
						<Header {...mockProps} />
					</ResponsiveContext.Provider>
				),
			},
		]);

		render(<RouterProvider router={router} />);

		const button = screen.getByTestId('icon');

		expect(button).toHaveClass(/moon/);
	});
	it(`should render the sun icon if darkTheme prop is not provided and user's device screen is wider than 440 pixels.`, () => {
		const mockProps = {
			darkTheme: false,
		};

		const router = createMemoryRouter([
			{
				path: '/',
				element: (
					<ResponsiveContext.Provider value={{ width: 440 }}>
						<Header {...mockProps} />
					</ResponsiveContext.Provider>
				),
			},
		]);

		render(<RouterProvider router={router} />);

		const button = screen.getByTestId('icon');

		expect(button).toHaveClass(/sun/);
	});
	it(`should active dropdown menu if account button is clicked`, async () => {
		const user = userEvent.setup();
		const mockProps = {
			onActiveMenu: vi.fn(),
		};

		const router = createMemoryRouter([
			{
				path: '/',
				element: <Header {...mockProps} />,
			},
		]);

		render(<RouterProvider router={router} />);

		const button = screen.getByTestId('account-button');

		await user.click(button);

		const element = screen.getByTestId('dropdown');

		expect(element).toHaveClass(/dropdown-slide-out/);
		expect(mockProps.onActiveMenu).toBeCalledTimes(1);
	});
	it(`should logged out user if logout button is clicked.`, async () => {
		const user = userEvent.setup();
		const mockProps = {
			isLogin: true,
			onUserId: vi.fn(),
			onActiveMenu: vi.fn(),
		};

		supabase.auth.getSession.mockResolvedValueOnce({
			data: {
				session: { user: { user_metadata: { login: true } } },
			},
		});

		const router = createMemoryRouter([
			{
				path: '/',
				element: <Header {...mockProps} />,
			},
		]);

		render(<RouterProvider router={router} />);

		const button = screen.getByRole('button', { name: 'Logout' });

		await user.click(button);

		expect(mockProps.onUserId).toBeCalledTimes(1);
		expect(supabase.auth.signOut).toBeCalledTimes(1);
		expect(supabase.auth.updateUser).toBeCalledTimes(1);
		expect(mockProps.onActiveMenu).toHaveBeenCalledTimes(1);
	});
	it(`should navigate to '/account/login' path if login button is clicked.`, async () => {
		const user = userEvent.setup();
		const mockProps = {
			isLogin: false,
			onActiveMenu: vi.fn(),
		};

		const router = createMemoryRouter([
			{
				path: '/',
				element: <Header {...mockProps} />,
			},
			{
				path: '/account/login',
				element: <p>Login page</p>,
			},
		]);

		render(<RouterProvider router={router} />);

		const link = screen.getByRole('link', { name: 'Login' });
		await user.click(link);

		const loginPage = screen.getByText('Login page');

		expect(loginPage).toBeInTheDocument();
	});
});
