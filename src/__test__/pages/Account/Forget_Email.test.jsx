import { expect, describe, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { RouterProvider, createMemoryRouter } from 'react-router-dom';
import { supabase } from '../../../utils/supabase_client';

import { ForgetEmail } from '../../../components/pages/Account/Forget_Email';
vi.mock('../../../utils/supabase_client');

describe('ForgetEmail component', () => {
	it('should change the field values if any input field is typed', async () => {
		const user = userEvent.setup();
		const mockProps = {
			onActiveModal: vi.fn(),
		};

		const router = createMemoryRouter([
			{
				path: '/',
				element: <ForgetEmail {...mockProps} />,
			},
		]);

		render(<RouterProvider router={router} />);

		const allInput = screen.getAllByText('Message Placeholder');

		const emailField = screen.getByLabelText('Enter your email');

		await user.type(emailField, 'email');

		const defaultMessage = screen.getAllByText('Message Placeholder');

		expect(defaultMessage.length).toBe(allInput.length);
		expect(emailField).toHaveValue('email');
	});
	it('should render the error field messages if email field fails validation after submission', async () => {
		const user = userEvent.setup();
		const mockProps = {
			onActiveModal: vi.fn(),
		};

		const router = createMemoryRouter([
			{
				path: '/',
				element: <ForgetEmail {...mockProps} />,
			},
		]);

		render(<RouterProvider router={router} />);
		const submitBtn = screen.getByRole('button', { name: 'Continue' });

		await user.click(submitBtn);

		const emailField = screen.getByLabelText('Enter your email');
		const emailErrorMessageWrap = screen.getByTestId('email-message');
		const emailErrorMessage = screen.getByText('Email is required.');

		expect(emailField).toHaveClass(/form-input-error/);
		expect(emailErrorMessageWrap).toHaveClass(/form-message-active/);
		expect(emailErrorMessage).toBeInTheDocument();
	});
	it('should render a modal with error messages if over email send rate limit error occurs after submission', async () => {
		const user = userEvent.setup();
		const mockProps = {
			onActiveModal: vi.fn(),
		};

		supabase.auth.resetPasswordForEmail.mockResolvedValueOnce({
			error: {
				code: 'over_email_send_rate_limit',
			},
		});

		const router = createMemoryRouter([
			{
				path: '/',
				element: <ForgetEmail {...mockProps} />,
			},
		]);

		render(<RouterProvider router={router} />);

		const emailField = screen.getByLabelText('Enter your email');
		const submitBtn = screen.getByRole('button', { name: 'Continue' });

		await user.type(emailField, 'email@email.com');
		await user.click(submitBtn);

		expect(mockProps.onActiveModal).toBeCalledTimes(1);
	});
	it('should navigate to "/error" path if an unknown verification email delivery error occurs after submission', async () => {
		const user = userEvent.setup();
		const mockProps = {
			onActiveModal: vi.fn(),
		};

		supabase.auth.resetPasswordForEmail.mockResolvedValueOnce({
			error: {
				code: 'error',
			},
		});

		const router = createMemoryRouter([
			{
				path: '/',
				element: <ForgetEmail {...mockProps} />,
			},
			{
				path: '/error',
				element: <p>Error page</p>,
			},
		]);

		render(<RouterProvider router={router} />);

		const emailField = screen.getByLabelText('Enter your email');
		const submitBtn = screen.getByRole('button', { name: 'Continue' });

		await user.type(emailField, 'email@email.com');
		await user.click(submitBtn);

		const errorMessage = screen.getByText('Error page');

		expect(errorMessage).toBeInTheDocument();
		expect(mockProps.onActiveModal).toBeCalledTimes(1);
	});
	it('should render a modal with success messages if verification email is sent successfully', async () => {
		const user = userEvent.setup();
		const mockProps = {
			onActiveModal: vi.fn(),
		};

		supabase.auth.resetPasswordForEmail.mockResolvedValueOnce({
			error: null,
		});

		const router = createMemoryRouter([
			{
				path: '/',
				element: <ForgetEmail {...mockProps} />,
			},
		]);

		render(<RouterProvider router={router} />);

		const emailField = screen.getByLabelText('Enter your email');
		const submitBtn = screen.getByRole('button', { name: 'Continue' });

		await user.type(emailField, 'email@email.com');
		await user.click(submitBtn);

		expect(mockProps.onActiveModal).toBeCalledTimes(1);
	});
});
