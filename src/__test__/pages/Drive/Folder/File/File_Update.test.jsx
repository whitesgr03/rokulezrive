import { expect, describe, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { RouterProvider, createMemoryRouter } from 'react-router-dom';
import { supabase } from '../../../../../utils/supabase_client';
import { handleFetch } from '../../../../../utils/handle_fetch';

import { FileUpdate } from '../../../../../components/pages/Drive/Folder/File/File_Update';

vi.mock('../../../../../utils/supabase_client');
vi.mock('../../../../../utils/handle_fetch');

describe('FileUpdate component', () => {
	it('should change the field values if input field is typed', async () => {
		const user = userEvent.setup();
		const mockProps = {
			name: 'file',
			fileId: '1',
			onUpdateFolder: vi.fn(),
			onActiveModal: vi.fn(),
		};

		const mockName = 'test';

		const router = createMemoryRouter([
			{
				path: '/',
				element: <FileUpdate {...mockProps} />,
			},
		]);

		render(<RouterProvider router={router} />);

		const nameField = screen.getByLabelText('Rename File');

		await user.type(nameField, 'test');

		expect(nameField).toHaveValue(`${mockProps.name}${mockName}`);
	});
	it('should render the error field messages if email field fails validation after submission', async () => {
		const user = userEvent.setup();
		const mockProps = {
			name: 'file',
			fileId: '1',
			onUpdateFolder: vi.fn(),
			onActiveModal: vi.fn(),
		};

		const router = createMemoryRouter([
			{
				path: '/',
				element: <FileUpdate {...mockProps} />,
			},
		]);

		render(<RouterProvider router={router} />);

		const submitButton = screen.getByRole('button', 'Save');

		await user.click(submitButton);

		const nameField = screen.getByLabelText('Rename File');
		const nameErrorMessageWarp = screen.getByTestId('file-message');
		const nameErrorMessage = screen.getByText(
			'New file name should be different from the old file name.',
		);

		expect(nameField).toHaveClass(/form-input-error/);
		expect(nameErrorMessageWarp).toHaveClass(/form-message-active/);
		expect(nameErrorMessage).toBeInTheDocument();
	});
	it('should render an error field message if update file fails', async () => {
		const user = userEvent.setup();
		const mockProps = {
			name: 'file',
			fileId: '1',
			onUpdateFolder: vi.fn(),
			onActiveModal: vi.fn(),
		};

		supabase.auth.getSession.mockResolvedValueOnce({
			data: {
				session: { access_token: '' },
			},
		});

		handleFetch.mockResolvedValueOnce({
			success: false,
			fields: {
				name: 'error',
			},
		});

		const router = createMemoryRouter([
			{
				path: '/',
				element: <FileUpdate {...mockProps} />,
			},
			{
				path: '/drive/error',
				element: <p>Error page</p>,
			},
		]);

		render(<RouterProvider router={router} />);

		const nameField = screen.getByLabelText('Rename File');
		const submitButton = screen.getByRole('button', 'Save');

		await user.type(nameField, 'test');
		await user.click(submitButton);

		const nameErrorMessageWarp = screen.getByTestId('file-message');
		const nameErrorMessage = screen.getByText('error');

		expect(nameField).toHaveClass(/form-input-error/);
		expect(nameErrorMessageWarp).toHaveClass(/form-message-active/);
		expect(nameErrorMessage).toBeInTheDocument();
	});
	it('should navigate to "/drive/error" path if update file fails', async () => {
		const user = userEvent.setup();
		const mockProps = {
			name: 'file',
			fileId: '1',
			onUpdateFolder: vi.fn(),
			onActiveModal: vi.fn(),
		};

		supabase.auth.getSession.mockResolvedValueOnce({
			data: {
				session: { access_token: '' },
			},
		});

		handleFetch.mockResolvedValueOnce({
			success: false,
			message: 'error',
		});

		const router = createMemoryRouter([
			{
				path: '/',
				element: <FileUpdate {...mockProps} />,
			},
			{
				path: '/drive/error',
				element: <p>Error page</p>,
			},
		]);

		render(<RouterProvider router={router} />);

		const nameField = screen.getByLabelText('Rename File');
		const submitButton = screen.getByRole('button', 'Save');

		await user.type(nameField, 'test');
		await user.click(submitButton);

		const errorMessage = screen.getByText('Error page');
		expect(errorMessage).toBeInTheDocument();
		expect(mockProps.onActiveModal).toBeCalledTimes(1);
	});
	it('should update file if submit button is clicked', async () => {
		const user = userEvent.setup();
		const mockProps = {
			name: 'file',
			fileId: '1',
			onUpdateFolder: vi.fn(),
			onActiveModal: vi.fn(),
		};

		supabase.auth.getSession.mockResolvedValueOnce({
			data: {
				session: { access_token: '' },
			},
		});

		handleFetch.mockResolvedValueOnce({
			success: true,
			data: {},
		});

		const router = createMemoryRouter([
			{
				path: '/',
				element: <FileUpdate {...mockProps} />,
			},
		]);

		render(<RouterProvider router={router} />);

		const nameField = screen.getByLabelText('Rename File');
		const submitButton = screen.getByRole('button', 'Save');

		await user.type(nameField, 'test');
		await user.click(submitButton);

		expect(mockProps.onUpdateFolder).toBeCalledTimes(1);
		expect(mockProps.onActiveModal).toBeCalledTimes(1);
	});
});
