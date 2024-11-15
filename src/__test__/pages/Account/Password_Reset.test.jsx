import { expect, describe, it, vi } from 'vitest';
import {
	render,
	screen,
	waitForElementToBeRemoved,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
	RouterProvider,
	createMemoryRouter,
	Navigate,
	Outlet,
} from 'react-router-dom';
import { supabase } from '../../../utils/supabase_client';

import { PasswordReset } from '../../../components/pages/Account/Password_Reset';

vi.mock('../../../utils/supabase_client');

describe('PasswordReset component', () => {
	it('should navigate to "/" path if "resetPassword" state is not provided', () => {
		const mockContext = {
			onActiveModal: vi.fn(),
			onResetPassword: vi.fn(),
		};

		supabase.auth.updateUser.mockResolvedValueOnce();
		const router = createMemoryRouter(
			[
				{
					path: '/',
					element: (
						<>
							<p>Home page</p>
							<Outlet context={{ ...mockContext }} />
						</>
					),
					children: [
						{
							path: '/account/resetting-password',
							element: <PasswordReset />,
						},
					],
				},
				{
					path: '/mock',
					element: <Navigate to="/account/resetting-password" />,
				},
			],
			{ initialEntries: ['/mock'] },
		);

		render(<RouterProvider router={router} />);

		const element = screen.getByText('Home page');

		expect(element).toBeInTheDocument();
	});
	it('should set password reset states', async () => {
		const mockContext = {
			onActiveModal: vi.fn(),
			onResetPassword: vi.fn(),
		};

		const mockState = {
			resetPassword: true,
		};

		supabase.auth.updateUser.mockResolvedValueOnce();

		const router = createMemoryRouter(
			[
				{
					path: '/',
					element: <Outlet context={{ ...mockContext }} />,
					children: [
						{
							path: '/account/resetting-password',
							element: <PasswordReset />,
						},
					],
				},
				{
					path: '/mock',
					element: (
						<Navigate
							to="/account/resetting-password"
							state={{ ...mockState }}
						/>
					),
				},
			],
			{ initialEntries: ['/mock'] },
		);

		render(<RouterProvider router={router} />);

		await waitForElementToBeRemoved(() => screen.getByText(/loading/i));

		expect(supabase.auth.updateUser).toBeCalledWith({
			data: { resetPassword: true },
		});
	});
	it('should change the field values if any input field is typed', async () => {
		const user = userEvent.setup();
		const mockContext = {
			onActiveModal: vi.fn(),
			onResetPassword: vi.fn(),
		};
		const mockState = {
			resetPassword: true,
		};
		supabase.auth.updateUser.mockResolvedValueOnce();

		const router = createMemoryRouter(
			[
				{
					path: '/',
					element: <Outlet context={{ ...mockContext }} />,
					children: [
						{
							path: '/account/resetting-password',
							element: <PasswordReset />,
						},
					],
				},
				{
					path: '/mock',
					element: (
						<Navigate
							to="/account/resetting-password"
							state={{ ...mockState }}
						/>
					),
				},
			],
			{ initialEntries: ['/mock'] },
		);

		render(<RouterProvider router={router} />);

		const allInput = await screen.findAllByText('Message Placeholder');

		const passwordField = await screen.findByLabelText('New Password');

		await user.type(passwordField, 'password');

		const defaultMessage = screen.getAllByText('Message Placeholder');

		expect(defaultMessage.length).toBe(allInput.length);
		expect(passwordField).toHaveValue('password');
	});
	it('should render the error field messages if any field fails validation after submission', async () => {
		const user = userEvent.setup();
		const mockContext = {
			onActiveModal: vi.fn(),
			onResetPassword: vi.fn(),
		};
		const mockState = {
			resetPassword: true,
		};

		supabase.auth.updateUser.mockResolvedValueOnce();

		const router = createMemoryRouter(
			[
				{
					path: '/',
					element: <Outlet context={{ ...mockContext }} />,
					children: [
						{
							path: '/account/resetting-password',
							element: <PasswordReset />,
						},
					],
				},
				{
					path: '/mock',
					element: (
						<Navigate
							to="/account/resetting-password"
							state={{ ...mockState }}
						/>
					),
				},
			],
			{ initialEntries: ['/mock'] },
		);

		render(<RouterProvider router={router} />);

		const submitBtn = await screen.findByRole('button', { name: 'Submit' });

		await user.click(submitBtn);

		const newPasswordField = screen.getByLabelText('New Password');
		const newPasswordErrorMessageWrap = screen.getByTestId('password-message');
		const newPasswordErrorMessage = screen.getByText('Password is required.');

		const confirmNewPasswordField = screen.getByLabelText(
			'Confirm New Password',
		);
		const confirmNewPasswordErrorMessageWrap = screen.getByTestId(
			'confirm-password-message',
		);
		const confirmNewPasswordErrorMessage = screen.getByText(
			'Confirm password is required.',
		);

		expect(newPasswordField).toHaveClass(/form-input-error/);
		expect(confirmNewPasswordField).toHaveClass(/form-input-error/);
		expect(newPasswordErrorMessageWrap).toHaveClass(/form-message-active/);
		expect(confirmNewPasswordErrorMessageWrap).toHaveClass(
			/form-message-active/,
		);
		expect(newPasswordErrorMessage).toBeInTheDocument();
		expect(confirmNewPasswordErrorMessage).toBeInTheDocument();
	});
	it('should render an error messages if same password error occurs after submission', async () => {
		const user = userEvent.setup();
		const mockContext = {
			onActiveModal: vi.fn(),
			onResetPassword: vi.fn(),
		};
		const mockState = {
			resetPassword: true,
		};

		supabase.auth.updateUser
			.mockResolvedValueOnce({ error: null })
			.mockResolvedValueOnce({
				error: {
					code: 'same_password',
				},
			});

		const router = createMemoryRouter(
			[
				{
					path: '/',
					element: <Outlet context={{ ...mockContext }} />,
					children: [
						{
							path: '/account/resetting-password',
							element: <PasswordReset />,
						},
					],
				},
				{
					path: '/mock',
					element: (
						<Navigate
							to="/account/resetting-password"
							state={{ ...mockState }}
						/>
					),
				},
			],
			{ initialEntries: ['/mock'] },
		);

		render(<RouterProvider router={router} />);

		const submitBtn = await screen.findByRole('button', { name: 'Submit' });

		const newPasswordField = screen.getByLabelText('New Password');
		const confirmNewPasswordField = screen.getByLabelText(
			'Confirm New Password',
		);

		await user.type(newPasswordField, '1!Qwerty');
		await user.type(confirmNewPasswordField, '1!Qwerty');
		await user.click(submitBtn);

		const errorMessage = screen.getByText(
			'New password should be different from the old password.',
		);

		expect(errorMessage).toBeInTheDocument();
	});
	it('should navigate to "/error" path if an unknown password reset error occurs after submission', async () => {
		const user = userEvent.setup();
		const mockContext = {
			onActiveModal: vi.fn(),
			onResetPassword: vi.fn(),
		};
		const mockState = {
			resetPassword: true,
		};

		supabase.auth.updateUser
			.mockResolvedValueOnce({ error: null })
			.mockResolvedValueOnce({
				error: {
					code: 'unknown',
				},
			});

		const router = createMemoryRouter(
			[
				{
					path: '/',
					element: <Outlet context={{ ...mockContext }} />,
					children: [
						{
							path: '/account/resetting-password',
							element: <PasswordReset />,
						},
					],
				},
				{
					path: '/mock',
					element: (
						<Navigate
							to="/account/resetting-password"
							state={{ ...mockState }}
						/>
					),
				},
				{
					path: '/error',
					element: <p>Error page</p>,
				},
			],
			{ initialEntries: ['/mock'] },
		);

		render(<RouterProvider router={router} />);

		const submitBtn = await screen.findByRole('button', { name: 'Submit' });

		const newPasswordField = screen.getByLabelText('New Password');
		const confirmNewPasswordField = screen.getByLabelText(
			'Confirm New Password',
		);

		await user.type(newPasswordField, '1!Qwerty');
		await user.type(confirmNewPasswordField, '1!Qwerty');
		await user.click(submitBtn);

		const errorMessage = screen.getByText('Error page');

		expect(errorMessage).toBeInTheDocument();
	});
	it('should render modal with success message if password reset is successful', async () => {
		const user = userEvent.setup();
		const mockContext = {
			onActiveModal: vi.fn(),
			onResetPassword: vi.fn(),
		};
		const mockState = {
			resetPassword: true,
		};

		supabase.auth.updateUser.mockResolvedValue({ error: null });

		const router = createMemoryRouter(
			[
				{
					path: '/',
					element: <Outlet context={{ ...mockContext }} />,
					children: [
						{
							path: '/account/resetting-password',
							element: <PasswordReset />,
						},
						{
							path: '/account/login',
							element: <p>Login page</p>,
						},
					],
				},
				{
					path: '/mock',
					element: (
						<Navigate
							to="/account/resetting-password"
							state={{ ...mockState }}
						/>
					),
				},
			],
			{ initialEntries: ['/mock'] },
		);

		render(<RouterProvider router={router} />);

		const submitBtn = await screen.findByRole('button', { name: 'Submit' });

		const newPasswordField = screen.getByLabelText('New Password');
		const confirmNewPasswordField = screen.getByLabelText(
			'Confirm New Password',
		);

		await user.type(newPasswordField, '1!Qwerty');
		await user.type(confirmNewPasswordField, '1!Qwerty');
		await user.click(submitBtn);

		const errorMessage = screen.getByText('Login page');

		expect(errorMessage).toBeInTheDocument();
		expect(mockContext.onActiveModal).toBeCalledTimes(1);
		expect(mockContext.onResetPassword).toBeCalledTimes(1);
		expect(supabase.auth.signOut).toBeCalledTimes(1);
	});
});