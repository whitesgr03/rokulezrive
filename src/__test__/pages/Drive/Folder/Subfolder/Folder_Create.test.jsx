import { expect, describe, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { RouterProvider, createMemoryRouter } from 'react-router-dom';
import { supabase } from '../../../../../utils/supabase_client';
import { handleFetch } from '../../../../../utils/handle_fetch';

import { FolderCreate } from '../../../../../components/pages/Drive/Folder/Subfolder/Folder_Create';

vi.mock('../../../../../utils/supabase_client');
vi.mock('../../../../../utils/handle_fetch');

describe('FolderCreate component', () => {
	it('should change the field values if input field is typed', async () => {
		const user = userEvent.setup();
		const mockProps = {
			folderId: '1',
			onUpdateFolder: vi.fn(),
			onActiveModal: vi.fn(),
		};

		const router = createMemoryRouter([
			{
				path: '/',
				element: <FolderCreate {...mockProps} />,
			},
		]);

		render(<RouterProvider router={router} />);

		const nameField = screen.getByLabelText('Folder Name');

		await user.type(nameField, 'test');

		expect(nameField).toHaveValue('test');
	});
	it('should render the error field messages if email field fails validation after submission', async () => {
		const user = userEvent.setup();
		const mockProps = {
			folderId: '1',
			onUpdateFolder: vi.fn(),
			onActiveModal: vi.fn(),
		};

		const router = createMemoryRouter([
			{
				path: '/',
				element: <FolderCreate {...mockProps} />,
			},
		]);

		render(<RouterProvider router={router} />);

		const submitButton = screen.getByRole('button', { name: 'Create' });

		await user.click(submitButton);

		const nameField = screen.getByLabelText('Folder Name');
		const nameErrorMessageWarp = screen.getByTestId('folder-message');
		const nameErrorMessage = screen.getByText('Folder name is required.');

		expect(nameField).toHaveClass(/form-input-error/);
		expect(nameErrorMessageWarp).toHaveClass(/form-message-active/);
		expect(nameErrorMessage).toBeInTheDocument();
	});
	it('should render an error field message if create folder fails', async () => {
		const user = userEvent.setup();
		const mockProps = {
			folderId: '1',
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
				name: 'error file',
			},
		});

		const router = createMemoryRouter([
			{
				path: '/',
				element: <FolderCreate {...mockProps} />,
			},
		]);

		render(<RouterProvider router={router} />);

		const nameField = screen.getByLabelText('Folder Name');
		const submitButton = screen.getByRole('button', { name: 'Create' });

		await user.type(nameField, 'test');
		await user.click(submitButton);

		const nameErrorMessageWarp = screen.getByTestId('folder-message');
		const nameErrorMessage = screen.getByText('error file');

		expect(nameField).toHaveClass(/form-input-error/);
		expect(nameErrorMessageWarp).toHaveClass(/form-message-active/);
		expect(nameErrorMessage).toBeInTheDocument();
	});
	it('should navigate to "/drive/error" path if create folder fails', async () => {
		const user = userEvent.setup();
		const mockProps = {
			folderId: '1',
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
				element: <FolderCreate {...mockProps} />,
			},
			{
				path: '/drive/error',
				element: <p>Error page</p>,
			},
		]);

		render(<RouterProvider router={router} />);

		const nameField = screen.getByLabelText('Folder Name');
		const submitButton = screen.getByRole('button', { name: 'Create' });

		await user.type(nameField, 'test');
		await user.click(submitButton);

		const errorMessage = screen.getByText('Error page');

		expect(errorMessage).toBeInTheDocument();
		expect(mockProps.onActiveModal).toBeCalledTimes(1);
	});
	it('should navigate to homepage if the folder under any sub-path on the default parent folder is successfully created', async () => {
		const user = userEvent.setup();
		const mockProps = {
			folderId: '1',
			onUpdateFolder: vi.fn(),
			onActiveModal: vi.fn(),
		};

		supabase.auth.getSession.mockResolvedValueOnce({
			data: {
				session: { access_token: '' },
				data: {},
			},
		});

		handleFetch.mockReturnValueOnce({ success: true, data: {} });

		const router = createMemoryRouter(
			[
				{
					path: '/drive',
					element: <p>Home page</p>,
				},
				{
					path: '/drive/files/:id',
					element: <FolderCreate {...mockProps} />,
				},
			],
			{ initialEntries: ['/drive/files/1'] },
		);

		render(<RouterProvider router={router} />);

		const nameField = screen.getByLabelText('Folder Name');
		const submitButton = screen.getByRole('button', { name: 'Create' });

		await user.type(nameField, 'test');
		await user.click(submitButton);

		const element = screen.getByText('Home page');

		expect(element).toBeInTheDocument();
		expect(mockProps.onUpdateFolder).toBeCalledTimes(1);
		expect(mockProps.onActiveModal).toBeCalledTimes(1);
	});
	it('should navigate to the parent folder path if the folder under any sub-path on the parent folder page is successfully created', async () => {
		const user = userEvent.setup();
		const mockProps = {
			folderId: '1',
			onUpdateFolder: vi.fn(),
			onActiveModal: vi.fn(),
		};

		supabase.auth.getSession.mockResolvedValueOnce({
			data: {
				session: { access_token: '' },
				data: {},
			},
		});

		handleFetch.mockReturnValueOnce({ success: true, data: {} });

		const router = createMemoryRouter(
			[
				{
					path: '/drive/folders/:id',
					element: <p>Home page</p>,
				},
				{
					path: '/drive/folders/:id/shared/:id',
					element: <FolderCreate {...mockProps} />,
				},
			],
			{ initialEntries: ['/drive/folders/1/shared/1'] },
		);

		render(<RouterProvider router={router} />);

		const nameField = screen.getByLabelText('Folder Name');
		const submitButton = screen.getByRole('button', { name: 'Create' });

		await user.type(nameField, 'test');
		await user.click(submitButton);

		const element = screen.getByText('Home page');

		expect(element).toBeInTheDocument();
		expect(mockProps.onUpdateFolder).toBeCalledTimes(1);
		expect(mockProps.onActiveModal).toBeCalledTimes(1);
	});
});
