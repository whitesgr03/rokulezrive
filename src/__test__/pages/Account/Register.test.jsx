import { expect, describe, it, vi } from 'vitest';
import {
	render,
	screen,
	waitForElementToBeRemoved,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { RouterProvider, createMemoryRouter, Outlet } from 'react-router-dom';
import { supabase } from '../../../utils/supabase_client';

import { Register } from '../../../components/pages/Account/Register';

vi.mock('../../../utils/supabase_client');

describe('Register component', () => {
	it('should cancel password reset status if the last user password reset was not completed', async () => {
		const mockProps = {
			onActiveModal: vi.fn(),
		};

		supabase.auth.getSession.mockResolvedValueOnce({
			data: { session: { user: { user_metadata: { resetPassword: true } } } },
		});
		supabase.auth.updateUser.mockResolvedValueOnce();

		const router = createMemoryRouter([
			{
				path: '/',
				element: <Outlet context={{ ...mockProps }} />,
				children: [
					{
						index: true,
						element: <Register />,
					},
				],
			},
		]);

		render(<RouterProvider router={router} />);

		await waitForElementToBeRemoved(() => screen.getByText(/loading/i));

		expect(supabase.auth.getSession).toBeCalledTimes(1);
		expect(supabase.auth.updateUser).toBeCalledWith({
			data: { resetPassword: false },
		});
	});
	it('should change the field values if any input field is typed', async () => {
		const user = userEvent.setup();
		const mockProps = {
			onActiveModal: vi.fn(),
		};

		supabase.auth.getSession.mockResolvedValueOnce({
			data: {},
		});

		const router = createMemoryRouter([
			{
				path: '/',
				element: <Outlet context={{ ...mockProps }} />,
				children: [
					{
						index: true,
						element: <Register />,
					},
				],
			},
		]);

		render(<RouterProvider router={router} />);

		await waitForElementToBeRemoved(() => screen.getByText(/loading/i));

		const allInput = screen.getAllByText('Message Placeholder');

		const emailField = screen.getByLabelText('Email');
		const passwordField = screen.getByLabelText('Password');
		const confirmPasswordField = screen.getByLabelText('Confirm Password');

		await user.type(emailField, 'email');
		await user.type(passwordField, 'password');
		await user.type(confirmPasswordField, 'confirm password');

		const defaultMessage = screen.getAllByText('Message Placeholder');

		expect(defaultMessage.length).toBe(allInput.length);

		expect(emailField).toHaveValue('email');
		expect(passwordField).toHaveValue('password');
		expect(confirmPasswordField).toHaveValue('confirm password');
	});
	it('should render the error field messages if email field fails validation after submission', async () => {
		const user = userEvent.setup();
		const mockProps = {
			onActiveModal: vi.fn(),
		};

		supabase.auth.getSession.mockResolvedValueOnce({
			data: {},
		});

		const router = createMemoryRouter([
			{
				path: '/',
				element: <Outlet context={{ ...mockProps }} />,
				children: [
					{
						index: true,
						element: <Register />,
					},
				],
			},
		]);

		render(<RouterProvider router={router} />);

		const submitBtn = await screen.findByRole('button', { name: 'Submit' });

		await user.click(submitBtn);

		const emailField = screen.getByLabelText('Email');
		const emailErrorMessageWrap = screen.getByTestId('email-message');
		const emailErrorMessage = screen.getByText('Email is required.');

		const passwordField = screen.getByLabelText('Password');
		const passwordErrorMessageWrap = screen.getByTestId('password-message');
		const passwordErrorMessage = screen.getByText('Password is required.');

		const confirmPasswordField = screen.getByLabelText('Confirm Password');
		const confirmPasswordErrorMessageWrap = screen.getByTestId(
			'confirm-password-message',
		);
		const confirmPasswordErrorMessage = screen.getByText(
			'Confirm password is required.',
		);

		expect(emailField).toHaveClass(/form-input-error/);
		expect(emailErrorMessageWrap).toHaveClass(/form-message-active/);
		expect(emailErrorMessage).toBeInTheDocument();

		expect(passwordField).toHaveClass(/form-input-error/);
		expect(passwordErrorMessageWrap).toHaveClass(/form-message-active/);
		expect(passwordErrorMessage).toBeInTheDocument();

		expect(confirmPasswordField).toHaveClass(/form-input-error/);
		expect(confirmPasswordErrorMessageWrap).toHaveClass(/form-message-active/);
		expect(confirmPasswordErrorMessage).toBeInTheDocument();
	});
	it('should render a modal with error messages if over email send rate limit error occurs after submission', async () => {
		const user = userEvent.setup();
		const mockProps = {
			onActiveModal: vi.fn(),
		};

		supabase.auth.getSession.mockResolvedValueOnce({
			data: {},
		});

		supabase.auth.signUp.mockResolvedValueOnce({
			error: {
				code: 'over_email_send_rate_limit',
			},
		});

		const router = createMemoryRouter([
			{
				path: '/',
				element: <Outlet context={{ ...mockProps }} />,
				children: [
					{
						index: true,
						element: <Register />,
					},
				],
			},
		]);

		render(<RouterProvider router={router} />);

		await waitForElementToBeRemoved(() => screen.getByText(/loading/i));

		const emailField = screen.getByLabelText('Email');
		const passwordField = screen.getByLabelText('Password');
		const confirmPasswordField = screen.getByLabelText('Confirm Password');

		const submitBtn = await screen.findByRole('button', { name: 'Submit' });

		await user.type(emailField, 'email@email.com');
		await user.type(passwordField, '1!Qwerty');
		await user.type(confirmPasswordField, '1!Qwerty');
		await user.click(submitBtn);

		expect(mockProps.onActiveModal).toBeCalledTimes(1);
	});
	it('should navigate to "/error" path if an unknown register error occurs after submission', async () => {
		const user = userEvent.setup();
		const mockProps = {
			onActiveModal: vi.fn(),
		};

		supabase.auth.getSession.mockResolvedValueOnce({
			data: {},
		});

		supabase.auth.signUp.mockResolvedValueOnce({
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
						element: <Register />,
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
		const confirmPasswordField = screen.getByLabelText('Confirm Password');

		const submitBtn = await screen.findByRole('button', { name: 'Submit' });

		await user.type(emailField, 'email@email.com');
		await user.type(passwordField, '1!Qwerty');
		await user.type(confirmPasswordField, '1!Qwerty');
		await user.click(submitBtn);

		const errorMessage = screen.getByText('Error page');

		expect(errorMessage).toBeInTheDocument();
	});
	it('should render the error messages if email has been registered', async () => {
		const user = userEvent.setup();
		const mockProps = {
			onActiveModal: vi.fn(),
		};

		supabase.auth.getSession.mockResolvedValueOnce({
			data: {},
		});

		supabase.auth.signUp.mockResolvedValueOnce({
			data: {
				user: {
					identities: [],
				},
			},
		});

		const router = createMemoryRouter([
			{
				path: '/',
				element: <Outlet context={{ ...mockProps }} />,
				children: [
					{
						index: true,
						element: <Register />,
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
		const confirmPasswordField = screen.getByLabelText('Confirm Password');

		const submitBtn = await screen.findByRole('button', { name: 'Submit' });

		await user.type(emailField, 'email@email.com');
		await user.type(passwordField, '1!Qwerty');
		await user.type(confirmPasswordField, '1!Qwerty');
		await user.click(submitBtn);

		const emailErrorMessageWrap = screen.getByTestId('email-message');
		const emailErrorMessage = screen.getByText('Email has been registered.');

		expect(emailField).toHaveClass(/form-input-error/);
		expect(emailErrorMessageWrap).toHaveClass(/form-message-active/);
		expect(emailErrorMessage).toBeInTheDocument();
	});
	it('should render a modal with success message if register is successful', async () => {
		const user = userEvent.setup();
		const mockProps = {
			onActiveModal: vi.fn(),
		};

		supabase.auth.getSession.mockResolvedValueOnce({
			data: {},
		});

		supabase.auth.signUp.mockResolvedValueOnce({
			data: {
				user: {
					identities: ['mockUser'],
				},
			},
		});

		const router = createMemoryRouter([
			{
				path: '/',
				element: <Outlet context={{ ...mockProps }} />,
				children: [
					{
						index: true,
						element: <Register />,
					},
				],
			},
			{
				path: '/account/login',
				element: <p>Login page</p>,
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
		const confirmPasswordField = screen.getByLabelText('Confirm Password');

		const submitBtn = await screen.findByRole('button', { name: 'Submit' });

		await user.type(emailField, 'email@email.com');
		await user.type(passwordField, '1!Qwerty');
		await user.type(confirmPasswordField, '1!Qwerty');
		await user.click(submitBtn);

		const loginPage = screen.getByText('Login page');

		expect(loginPage).toBeInTheDocument();
		expect(mockProps.onActiveModal).toBeCalledTimes(1);
	});
});

