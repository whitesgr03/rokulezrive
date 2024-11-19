import { expect, describe, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { RouterProvider, createMemoryRouter } from 'react-router-dom';
import { supabase } from '../../../../../utils/supabase_client';
import { handleFetch } from '../../../../../utils/handle_fetch';

import { FileDelete } from '../../../../../components/pages/Drive/Folder/File/File_Delete';

vi.mock('../../../../../utils/supabase_client');
vi.mock('../../../../../utils/handle_fetch');

describe('FileUpdate component', () => {
	it('should navigate to "/drive/error" path if delete file fails', async () => {
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
				element: <FileDelete {...mockProps} />,
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
	});
	it('should close modal if cancel button is clicked', async () => {
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
				element: <FileDelete {...mockProps} />,
			},
		]);

		render(<RouterProvider router={router} />);

		const closeButton = screen.getByRole('button', { name: 'Cancel' });

		await user.click(closeButton);

		expect(mockProps.onActiveModal).toBeCalledTimes(1);
	});
	it('should delete file if submit button is clicked', async () => {
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
				element: <FileDelete {...mockProps} />,
			},
		]);

		render(<RouterProvider router={router} />);

		const submitButton = screen.getByRole('button', { name: 'Delete' });

		await user.click(submitButton);

		expect(mockProps.onUpdateFolder).toBeCalledTimes(1);
	});
});
