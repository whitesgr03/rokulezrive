import { expect, describe, it, vi } from 'vitest';
import {
	render,
	screen,
	waitForElementToBeRemoved,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { RouterProvider, createMemoryRouter, Outlet } from 'react-router-dom';
import { supabase } from '../../../utils/supabase_client';

import { PasswordReset } from '../../../components/pages/Account/Password_Reset';

vi.mock('../../../utils/supabase_client');

describe('PasswordReset component', () => {
	it('should navigate to "/error" path  if user password reset permission is not authenticated', async () => {
		const mockContext = {
			onActiveModal: vi.fn(),
		};

		supabase.auth.getSession.mockResolvedValueOnce({
			data: {
				session: null,
			},
		});

		const router = createMemoryRouter([
			{
				path: '/',
				element: <Outlet context={{ ...mockContext }} />,
				children: [
					{
						index: true,
						element: <PasswordReset />,
					},
					{
						path: 'error',
						element: <p>Error page</p>,
					},
				],
			},
		]);

		render(<RouterProvider router={router} />);

		await waitForElementToBeRemoved(() => screen.getByText(/loading/i));

		const errorPage = screen.getByText('Error page');

		expect(errorPage).toBeInTheDocument();
	});
	it('should set password reset states if user password reset permission has been authenticated', async () => {
		const mockContext = {
			onActiveModal: vi.fn(),
		};

		supabase.auth.getSession.mockResolvedValueOnce({
			data: {
				session: {
					user: {
						app_metadata: {
							provider: 'email',
						},

						user_metadata: {
							login: false,
						},
					},
				},
			},
		});

		const router = createMemoryRouter([
			{
				path: '/',
				element: <Outlet context={{ ...mockContext }} />,
				children: [
					{
						index: true,
						element: <PasswordReset />,
					},
				],
			},
		]);

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
		};

		supabase.auth.getSession.mockResolvedValueOnce({
			data: {
				session: {
					user: {
						app_metadata: {
							provider: 'email',
						},

						user_metadata: {
							login: false,
						},
					},
				},
			},
		});

		const router = createMemoryRouter([
			{
				path: '/',
				element: <Outlet context={{ ...mockContext }} />,
				children: [
					{
						index: true,
						element: <PasswordReset />,
					},
				],
			},
		]);

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
		};

		supabase.auth.getSession.mockResolvedValueOnce({
			data: {
				session: {
					user: {
						app_metadata: {
							provider: 'email',
						},

						user_metadata: {
							login: false,
						},
					},
				},
			},
		});

		const router = createMemoryRouter([
			{
				path: '/',
				element: <Outlet context={{ ...mockContext }} />,
				children: [
					{
						index: true,
						element: <PasswordReset />,
					},
				],
			},
		]);

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
		expect(newPasswordErrorMessageWrap).toHaveClass(/form-message-active/);
		expect(newPasswordErrorMessage).toBeInTheDocument();

		expect(confirmNewPasswordField).toHaveClass(/form-input-error/);
		expect(confirmNewPasswordErrorMessageWrap).toHaveClass(
			/form-message-active/,
		);
		expect(confirmNewPasswordErrorMessage).toBeInTheDocument();
	});
	it('should render an error message if same password error occurs after submission', async () => {
		const user = userEvent.setup();

		const mockContext = {
			onActiveModal: vi.fn(),
		};

		supabase.auth.getSession.mockResolvedValueOnce({
			data: {
				session: {
					user: {
						app_metadata: {
							provider: 'email',
						},

						user_metadata: {
							login: false,
						},
					},
				},
			},
		});

		supabase.auth.updateUser.mockResolvedValueOnce().mockResolvedValueOnce({
			error: {
				code: 'same_password',
			},
		});

		const router = createMemoryRouter([
			{
				path: '/',
				element: <Outlet context={{ ...mockContext }} />,
				children: [
					{
						index: true,
						element: <PasswordReset />,
					},
				],
			},
		]);

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
		};

		supabase.auth.getSession.mockResolvedValueOnce({
			data: {
				session: {
					user: {
						app_metadata: {
							provider: 'email',
						},

						user_metadata: {
							login: false,
						},
					},
				},
			},
		});

		supabase.auth.updateUser.mockResolvedValueOnce().mockResolvedValueOnce({
			error: {
				code: 'unknown',
			},
		});

		const router = createMemoryRouter([
			{
				path: '/',
				element: <Outlet context={{ ...mockContext }} />,
				children: [
					{
						index: true,
						element: <PasswordReset />,
					},
					{
						path: 'error',
						element: <p>Error page</p>,
					},
				],
			},
		]);

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
	it(`should render modal with success message and navigate to '/account/login' path if password reset is successful`, async () => {
		const user = userEvent.setup();

		const mockContext = {
			onActiveModal: vi.fn(),
		};

		supabase.auth.getSession.mockResolvedValueOnce({
			data: {
				session: {
					user: {
						app_metadata: {
							provider: 'email',
						},

						user_metadata: {
							login: false,
						},
					},
				},
			},
		});

		supabase.auth.updateUser.mockResolvedValueOnce().mockResolvedValueOnce({
			error: null,
		});

		supabase.auth.signOut.mockResolvedValueOnce();

		const router = createMemoryRouter([
			{
				path: '/',
				element: <Outlet context={{ ...mockContext }} />,
				children: [
					{
						index: true,
						element: <PasswordReset />,
					},
					{
						path: '/account/login',
						element: <p>Login page</p>,
					},
				],
			},
		]);

		render(<RouterProvider router={router} />);

		const submitBtn = await screen.findByRole('button', { name: 'Submit' });

		const newPasswordField = screen.getByLabelText('New Password');
		const confirmNewPasswordField = screen.getByLabelText(
			'Confirm New Password',
		);

		await user.type(newPasswordField, '1!Qwerty');
		await user.type(confirmNewPasswordField, '1!Qwerty');
		await user.click(submitBtn);

		const loginPage = screen.getByText('Login page');

		expect(loginPage).toBeInTheDocument();
		expect(mockContext.onActiveModal).toBeCalledTimes(1);
		expect(supabase.auth.signOut).toBeCalledTimes(1);
	});
});
