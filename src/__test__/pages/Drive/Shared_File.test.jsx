import { expect, describe, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { RouterProvider, createMemoryRouter, Outlet } from 'react-router-dom';
import { supabase } from '../../../utils/supabase_client';
import { handleFetch, handleFetchBlob } from '../../../utils/handle_fetch';
import { createDownloadElement } from '../../../utils/create_download_element';

import { SharedFile } from '../../../components/pages/Drive/Shared_File';

vi.mock('../../../utils/supabase_client');
vi.mock('../../../utils/handle_fetch');
vi.mock('../../../utils/create_download_element');

describe('FileInfo component', () => {
	it('should navigate to "/drive/error" path if shared file is not found', () => {
		const mockContext = {
			sharedFiles: [],
			downloading: false,
			onResetSVGAnimate: vi.fn(),
		};

		const fileId = '1';

		const router = createMemoryRouter(
			[
				{
					path: '/drive',
					element: <Outlet context={{ ...mockContext }} />,
					children: [
						{
							path: 'shared-file/:fileId',
							element: <SharedFile />,
						},
						{
							path: 'error',
							element: <p>Error page</p>,
						},
					],
				},
			],
			{ initialEntries: [`/drive/shared-file/${fileId}`] },
		);

		render(<RouterProvider router={router} />);

		const errorMessage = screen.getByText('Error page');

		expect(errorMessage).toBeInTheDocument();
	});
	it('should navigate to "/drive/error" path if get resource url is fails', async () => {
		const user = userEvent.setup();
		const mockContext = {
			sharedFiles: [
				{
					file: {
						id: '1',
						name: 'shared file',
						type: 'image',
						size: 1,
						owner: {
							email: 'email@email.com',
						},
					},
					sharedAt: new Date(),
				},
			],
			downloading: false,
			onResetSVGAnimate: vi.fn(),
		};
		const fileId = '1';

		supabase.auth.getSession.mockResolvedValueOnce({
			data: {
				session: { access_token: '' },
			},
		});
		handleFetch.mockResolvedValueOnce({ success: false, message: 'error' });

		const router = createMemoryRouter(
			[
				{
					path: '/drive',
					element: <Outlet context={{ ...mockContext }} />,
					children: [
						{
							path: 'shared-file/:fileId',
							element: <SharedFile />,
						},
						{
							path: 'error',
							element: <p>Error page</p>,
						},
					],
				},
			],
			{ initialEntries: [`/drive/shared-file/${fileId}`] },
		);

		render(<RouterProvider router={router} />);

		const downloadBtn = screen.getByRole('button', { name: 'Download' });

		await user.click(downloadBtn);

		const errorMessage = screen.getByText('Error page');

		expect(errorMessage).toBeInTheDocument();
	});
	it('should navigate to "/drive/error" path if get resource blob is fails', async () => {
		const user = userEvent.setup();
		const mockContext = {
			sharedFiles: [
				{
					file: {
						id: '1',
						name: 'shared file',
						type: 'image',
						size: 1,
						owner: {
							email: 'email@email.com',
						},
					},
					sharedAt: new Date(),
				},
			],
			downloading: false,
			onResetSVGAnimate: vi.fn(),
		};
		const fileId = '1';

		supabase.auth.getSession.mockResolvedValueOnce({
			data: {
				session: { access_token: '' },
			},
		});
		handleFetch.mockResolvedValueOnce({ success: true, data: { url: '' } });
		handleFetchBlob.mockResolvedValueOnce({ success: false });

		const router = createMemoryRouter(
			[
				{
					path: '/drive',
					element: <Outlet context={{ ...mockContext }} />,
					children: [
						{
							path: 'shared-file/:fileId',
							element: <SharedFile />,
						},
						{
							path: 'error',
							element: <p>Error page</p>,
						},
					],
				},
			],
			{ initialEntries: [`/drive/shared-file/${fileId}`] },
		);

		render(<RouterProvider router={router} />);

		const downloadBtn = screen.getByRole('button', { name: 'Download' });

		await user.click(downloadBtn);

		const errorMessage = screen.getByText('Error page');

		expect(errorMessage).toBeInTheDocument();
		expect(mockContext.onResetSVGAnimate).toBeCalledTimes(1);
	});
	it('should download shared file if download button is clicked', async () => {
		const user = userEvent.setup();
		const mockContext = {
			sharedFiles: [
				{
					file: {
						id: '1',
						name: 'shared file',
						type: 'image',
						size: 1,
						owner: {
							email: 'email@email.com',
						},
					},
					sharedAt: new Date(),
				},
			],
			downloading: false,
			onResetSVGAnimate: vi.fn(),
		};
		const fileId = '1';

		supabase.auth.getSession.mockResolvedValueOnce({
			data: {
				session: { access_token: '' },
			},
		});
		handleFetch.mockResolvedValueOnce({ success: true, data: { url: '' } });
		handleFetchBlob.mockResolvedValueOnce({ success: true, blob: 'url' });

		const mockElement = {
			click: vi.fn(),
		};
		createDownloadElement.mockReturnValueOnce(mockElement);

		const router = createMemoryRouter(
			[
				{
					path: '/drive',
					element: <Outlet context={{ ...mockContext }} />,
					children: [
						{
							path: 'shared-file/:fileId',
							element: <SharedFile />,
						},
						{
							path: 'error',
							element: <p>Error page</p>,
						},
					],
				},
			],
			{ initialEntries: [`/drive/shared-file/${fileId}`] },
		);

		render(<RouterProvider router={router} />);

		const downloadBtn = screen.getByRole('button', { name: 'Download' });

		await user.click(downloadBtn);

		expect(mockContext.onResetSVGAnimate).toBeCalledTimes(1);
		expect(mockElement.click).toBeCalledTimes(1);
	});
});
