import { expect, describe, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { RouterProvider, createMemoryRouter } from 'react-router-dom';
import { supabase } from '../../../../../utils/supabase_client';
import { handleFetch } from '../../../../../utils/handle_fetch';
import { getDeletedFolderIds } from '../../../../../utils/get_deleted_folder_ids';

import { FolderDelete } from '../../../../../components/pages/Drive/Folder/Subfolder/Folder_Delete';

vi.mock('../../../../../utils/supabase_client');
vi.mock('../../../../../utils/handle_fetch');
vi.mock('../../../../../utils/get_deleted_folder_ids');

describe('FolderDelete component', () => {
	it('should navigate to "/drive/error" path if delete folder fails', async () => {
		const user = userEvent.setup();
		const mockProps = {
			folders: [],
			folder: { name: 'file', id: '1', _count: { subfolders: 0, files: 0 } },
			onDeleteFolder: vi.fn(),
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

		getDeletedFolderIds.mockReturnValueOnce([]);

		const router = createMemoryRouter([
			{
				path: '/',
				element: <FolderDelete {...mockProps} />,
			},
			{
				path: '/drive/error',
				element: <p>Error page</p>,
			},
		]);

		render(<RouterProvider router={router} />);

		const submitButton = screen.getByRole('button', { name: 'Delete' });

		await user.click(submitButton);

		const errorMessage = screen.getByText('Error page');
		expect(errorMessage).toBeInTheDocument();
		expect(mockProps.onActiveModal).toBeCalledTimes(1);
		expect(getDeletedFolderIds).toBeCalledTimes(1);
	});
	it('should close modal if cancel button is clicked', async () => {
		const user = userEvent.setup();
		const mockProps = {
			folders: [],
			folder: { name: 'file', id: '1', _count: { subfolders: 0, files: 0 } },
			onDeleteFolder: vi.fn(),
			onActiveModal: vi.fn(),
		};

		const router = createMemoryRouter([
			{
				path: '/',
				element: <FolderDelete {...mockProps} />,
			},
		]);

		render(<RouterProvider router={router} />);

		const closeButton = screen.getByRole('button', { name: 'Cancel' });

		await user.click(closeButton);

		expect(mockProps.onActiveModal).toBeCalledTimes(1);
	});
	it('should delete folder if delete button is clicked', async () => {
		const user = userEvent.setup();
		const mockProps = {
			folders: [],
			folder: { name: 'file', id: '1', _count: { subfolders: 0, files: 0 } },
			onDeleteFolder: vi.fn(),
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
				element: <FolderDelete {...mockProps} />,
			},
		]);

		render(<RouterProvider router={router} />);

		const deleteButton = screen.getByRole('button', { name: 'Delete' });

		await user.click(deleteButton);

		expect(mockProps.onDeleteFolder).toBeCalledTimes(1);
		expect(mockProps.onActiveModal).toBeCalledTimes(1);
	});
	it('should delete folder and files if delete button is clicked', async () => {
		const user = userEvent.setup();
		const mockProps = {
			folders: [],
			folder: { name: 'file', id: '1', _count: { subfolders: 0, files: 2 } },
			onUpdateFolder: vi.fn(),
			onActiveModal: vi.fn(),
		};

		const mockFiles = [
			{
				...mockProps.folder,
			},
			{
				id: '2',
				_count: { subfolders: 0, files: 1 },
			},
			{
				id: '5',
				_count: { subfolders: 0, files: 0 },
			},
		];

		supabase.auth.getSession.mockResolvedValueOnce({
			data: {
				session: { access_token: '' },
			},
		});

		handleFetch.mockResolvedValueOnce({
			success: true,
			data: {},
		});

		getDeletedFolderIds.mockReturnValue(mockFiles);

		const router = createMemoryRouter([
			{
				path: '/',
				element: <FolderDelete {...mockProps} />,
			},
		]);

		render(<RouterProvider router={router} />);

		const deleteButton = screen.getByRole('button', { name: 'Delete' });

		await user.click(deleteButton);

		expect(JSON.parse(handleFetch.mock.calls[0][1].body)).toStrictEqual({
			folderIds: mockFiles
				.filter(file => file._count.files)
				.map(file => file.id),
		});
	});
});
