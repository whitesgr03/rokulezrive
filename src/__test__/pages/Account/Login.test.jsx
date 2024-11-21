import { expect, describe, it, vi } from 'vitest';
import {
	render,
	screen,
	waitForElementToBeRemoved,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { RouterProvider, createMemoryRouter, Outlet } from 'react-router-dom';
import { supabase } from '../../../utils/supabase_client';

import { Login } from '../../../components/pages/Account/Login';

vi.mock('../../../utils/supabase_client');

describe('Login component', () => {
	it('should change the field values if any input field is typed', async () => {
		const user = userEvent.setup();
		const mockProps = {
			onActiveModal: vi.fn(),
			onUserId: vi.fn(),
		};

		supabase.auth.getSession.mockResolvedValueOnce({ data: {} });

		const router = createMemoryRouter([
			{
				path: '/',
				element: <Outlet context={{ ...mockProps }} />,
				children: [
					{
						index: true,
						element: <Login />,
					},
				],
			},
		]);

		render(<RouterProvider router={router} />);

		await waitForElementToBeRemoved(() => screen.getByText(/loading/i));

		const allInput = screen.getAllByText('Message Placeholder');

		const emailField = screen.getByLabelText('Email');
		const passwordField = screen.getByLabelText('Password');

		await user.type(emailField, 'email');
		await user.type(passwordField, 'password');

		const defaultMessage = screen.getAllByText('Message Placeholder');

		expect(defaultMessage.length).toBe(allInput.length);
		expect(emailField).toHaveValue('email');
		expect(passwordField).toHaveValue('password');
	});
	it('should render the error field messages if email field fails validation after submission', async () => {
		const user = userEvent.setup();
		const mockProps = {
			onActiveModal: vi.fn(),
			onUserId: vi.fn(),
		};
		supabase.auth.getSession.mockResolvedValueOnce({ data: {} });
		const router = createMemoryRouter([
			{
				path: '/',
				element: <Outlet context={{ ...mockProps }} />,
				children: [
					{
						index: true,
						element: <Login />,
					},
				],
			},
		]);

		render(<RouterProvider router={router} />);

		const submitBtn = await screen.findByRole('button', { name: 'Login' });

		await user.click(submitBtn);

		const emailField = screen.getByLabelText('Email');
		const emailErrorMessageWrap = screen.getByTestId('email-message');
		const emailErrorMessage = screen.getByText('Email is required.');

		const passwordField = screen.getByLabelText('Password');
		const passwordErrorMessageWrap = screen.getByTestId('password-message');
		const passwordErrorMessage = screen.getByText('Password is required.');

		expect(emailField).toHaveClass(/form-input-error/);
		expect(emailErrorMessageWrap).toHaveClass(/form-message-active/);
		expect(emailErrorMessage).toBeInTheDocument();

		expect(passwordField).toHaveClass(/form-input-error/);
		expect(passwordErrorMessageWrap).toHaveClass(/form-message-active/);
		expect(passwordErrorMessage).toBeInTheDocument();
	});
	it('should render an error messages if invalid credentials error occurs after submission', async () => {
		const user = userEvent.setup();

		const mockProps = {
			onActiveModal: vi.fn(),
			onUserId: vi.fn(),
		};

		supabase.auth.getSession.mockResolvedValueOnce({ data: {} });
		supabase.auth.signInWithPassword.mockResolvedValueOnce({
			error: {
				code: 'invalid_credentials',
			},
		});

		const router = createMemoryRouter([
			{
				path: '/',
				element: <Outlet context={{ ...mockProps }} />,
				children: [
					{
						index: true,
						element: <Login />,
					},
				],
			},
		]);

		render(<RouterProvider router={router} />);

		await waitForElementToBeRemoved(() => screen.getByText(/loading/i));

		const emailField = screen.getByLabelText('Email');
		const passwordField = screen.getByLabelText('Password');
		const submitBtn = screen.getByRole('button', { name: 'Login' });

		await user.type(emailField, 'email@email.com');
		await user.type(passwordField, '1!Qwerty');
		await user.click(submitBtn);

		const errorMessage = screen.getByText('Account could not be found.');

		expect(errorMessage).toBeInTheDocument();
		expect(supabase.auth.signInWithPassword).toBeCalledTimes(1);
	});
	it('should render an error messages if email not confirmed error occurs after submission', async () => {
		const user = userEvent.setup();

		const mockProps = {
			onActiveModal: vi.fn(),
			onUserId: vi.fn(),
		};

		supabase.auth.getSession.mockResolvedValueOnce({ data: {} });
		supabase.auth.signInWithPassword.mockResolvedValueOnce({
			error: {
				code: 'email_not_confirmed',
			},
		});

		const router = createMemoryRouter([
			{
				path: '/',
				element: <Outlet context={{ ...mockProps }} />,
				children: [
					{
						index: true,
						element: <Login />,
					},
				],
			},
		]);

		render(<RouterProvider router={router} />);

		await waitForElementToBeRemoved(() => screen.getByText(/loading/i));

		const emailField = screen.getByLabelText('Email');
		const passwordField = screen.getByLabelText('Password');
		const submitBtn = screen.getByRole('button', { name: 'Login' });

		await user.type(emailField, 'email@email.com');
		await user.type(passwordField, '1!Qwerty');
		await user.click(submitBtn);

		const errorMessage = screen.getByText(
			'Email is registered but not verified.',
		);

		expect(errorMessage).toBeInTheDocument();
		expect(supabase.auth.signInWithPassword).toBeCalledTimes(1);
	});
	it('should navigate to "/error" path if an unknown login error occurs after submission', async () => {
		const user = userEvent.setup();

		const mockProps = {
			onActiveModal: vi.fn(),
			onUserId: vi.fn(),
		};

		supabase.auth.getSession.mockResolvedValueOnce({ data: {} });
		supabase.auth.signInWithPassword.mockResolvedValueOnce({
			error: {
				code: 'error',
				message: 'error',
			},
		});

		const router = createMemoryRouter([
			{
				path: '/',
				element: <Outlet context={{ ...mockProps }} />,
				children: [
					{
						index: true,
						element: <Login />,
					},
				],
			},
			{
				path: '/error',
				element: <p>Error page</p>,
			},
		]);

		render(<RouterProvider router={router} />);

		await waitForElementToBeRemoved(() => screen.getByText(/loading/i));

		const emailField = screen.getByLabelText('Email');
		const passwordField = screen.getByLabelText('Password');
		const submitBtn = screen.getByRole('button', { name: 'Login' });

		await user.type(emailField, 'email@email.com');
		await user.type(passwordField, '1!Qwerty');
		await user.click(submitBtn);

		const errorMessage = screen.getByText('Error page');

		expect(errorMessage).toBeInTheDocument();
		expect(supabase.auth.signInWithPassword).toBeCalledTimes(1);
	});
	it('should navigate to "/drive" path if login is successful', async () => {
		const user = userEvent.setup();

		const mockProps = {
			onActiveModal: vi.fn(),
			onUserId: vi.fn(),
		};

		supabase.auth.getSession.mockResolvedValueOnce({ data: {} });
		supabase.auth.signInWithPassword.mockResolvedValueOnce({
			data: {
				user: { id: '1' },
			},
		});

		const router = createMemoryRouter([
			{
				path: '/',
				element: <Outlet context={{ ...mockProps }} />,
				children: [
					{
						index: true,
						element: <Login />,
					},
				],
			},
		]);

		render(<RouterProvider router={router} />);

		await waitForElementToBeRemoved(() => screen.getByText(/loading/i));

		const emailField = screen.getByLabelText('Email');
		const passwordField = screen.getByLabelText('Password');
		const submitBtn = screen.getByRole('button', { name: 'Login' });

		await user.type(emailField, 'email@email.com');
		await user.type(passwordField, '1!Qwerty');

		await user.click(submitBtn);

		expect(mockProps.onUserId).toBeCalledTimes(1);
	});
	it('should login with google account if "Sign in with Google" button is clicked', async () => {
		const user = userEvent.setup();

		const mockProps = {
			onActiveModal: vi.fn(),
			onUserId: vi.fn(),
		};

		supabase.auth.getSession.mockResolvedValueOnce({ data: {} });
		supabase.auth.signInWithOAuth.mockResolvedValueOnce();

		const router = createMemoryRouter([
			{
				path: '/',
				element: <Outlet context={{ ...mockProps }} />,
				children: [
					{
						index: true,
						element: <Login />,
					},
				],
			},
		]);

		render(<RouterProvider router={router} />);

		await waitForElementToBeRemoved(() => screen.getByText(/loading/i));

		const emailField = screen.getByLabelText('Email');
		const passwordField = screen.getByLabelText('Password');
		const loginBtn = screen.getByRole('button', {
			name: 'Google login icon Sign in with Google',
		});

		await user.type(emailField, 'email@email.com');
		await user.type(passwordField, '1!Qwerty');

		await user.click(loginBtn);

		expect(supabase.auth.signInWithOAuth).toBeCalledTimes(1);
	});
	it('should login with facebook account if "Sign in with Facebook" button is clicked', async () => {
		const user = userEvent.setup();

		const mockProps = {
			onActiveModal: vi.fn(),
			onUserId: vi.fn(),
		};

		supabase.auth.getSession.mockResolvedValueOnce({ data: {} });
		supabase.auth.signInWithOAuth.mockResolvedValueOnce();

		const router = createMemoryRouter([
			{
				path: '/',
				element: <Outlet context={{ ...mockProps }} />,
				children: [
					{
						index: true,
						element: <Login />,
					},
				],
			},
		]);

		render(<RouterProvider router={router} />);

		await waitForElementToBeRemoved(() => screen.getByText(/loading/i));

		const emailField = screen.getByLabelText('Email');
		const passwordField = screen.getByLabelText('Password');
		const loginBtn = screen.getByRole('button', {
			name: 'Facebook login icon Sign in with Facebook',
		});

		await user.type(emailField, 'email@email.com');
		await user.type(passwordField, '1!Qwerty');

		await user.click(loginBtn);

		expect(supabase.auth.signInWithOAuth).toBeCalledTimes(1);
	});
	it('should render "ForgetEmail" component if "Forget Password?" button is clicked', async () => {
		const user = userEvent.setup();

		const mockProps = {
			onActiveModal: vi.fn(),
			onUserId: vi.fn(),
		};

		supabase.auth.getSession.mockResolvedValueOnce({ data: {} });

		const router = createMemoryRouter([
			{
				path: '/',
				element: <Outlet context={{ ...mockProps }} />,
				children: [
					{
						index: true,
						element: <Login />,
					},
				],
			},
		]);

		render(<RouterProvider router={router} />);

		await waitForElementToBeRemoved(() => screen.getByText(/loading/i));

		const button = screen.getByRole('button', { name: 'Forget Password?' });

		await user.click(button);

		expect(mockProps.onActiveModal).toBeCalledTimes(1);
	});
});
