import { expect, describe, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { RouterProvider, createMemoryRouter, Outlet } from 'react-router-dom';
import { supabase } from '../../../../../utils/supabase_client';
import {
	handleFetch,
	handleFetchBlob,
} from '../../../../../utils/handle_fetch';
import { createDownloadElement } from '../../../../../utils/create_download_element';

import { FileInfo } from '../../../../../components/pages/Drive/Folder/File/File_Info';

vi.mock('../../../../../utils/supabase_client');
vi.mock('../../../../../utils/handle_fetch');
vi.mock('../../../../../utils/create_download_element');

describe('FileInfo component', () => {
	it('should navigate to "/drive/error" path and render error messages if file is not found', () => {
		const mockContext = {
			folder: {
				files: [],
			},
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
							path: 'file-info/:fileId',
							element: <FileInfo />,
						},
						{
							path: 'error',
							element: <p>Error page</p>,
						},
					],
				},
			],
			{ initialEntries: [`/drive/file-info/${fileId}`] },
		);

		render(<RouterProvider router={router} />);

		const errorMessage = screen.getByText('Error page');

		expect(errorMessage).toBeInTheDocument();
	});
	it('should navigate to "/drive/error" path and render error messages if get resource url is fails', async () => {
		const user = userEvent.setup();
		const mockContext = {
			folder: {
				files: [
					{
						id: '1',
						name: 'file',
						type: 'type',
						size: 123,
						createdAt: new Date(),
					},
				],
			},
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
							path: 'file-info/:fileId',
							element: <FileInfo />,
						},
						{
							path: 'error',
							element: <p>Error page</p>,
						},
					],
				},
			],
			{ initialEntries: [`/drive/file-info/${fileId}`] },
		);

		render(<RouterProvider router={router} />);

		const downloadBtn = screen.getByRole('button', { name: 'Download' });

		await user.click(downloadBtn);

		const errorMessage = screen.getByText('Error page');

		expect(errorMessage).toBeInTheDocument();
	});
	it('should navigate to "/drive/error" path and render error messages if get resource blob is fails', async () => {
		const user = userEvent.setup();
		const mockContext = {
			folder: {
				files: [
					{
						id: '1',
						name: 'file',
						type: 'type',
						size: 123,
						createdAt: new Date(),
					},
				],
			},
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
							path: 'file-info/:fileId',
							element: <FileInfo />,
						},
						{
							path: 'error',
							element: <p>Error page</p>,
						},
					],
				},
			],
			{ initialEntries: [`/drive/file-info/${fileId}`] },
		);

		render(<RouterProvider router={router} />);

		const downloadBtn = screen.getByRole('button', { name: 'Download' });

		await user.click(downloadBtn);

		const errorMessage = screen.getByText('Error page');

		expect(errorMessage).toBeInTheDocument();
		expect(mockContext.onResetSVGAnimate).toBeCalledTimes(1);
	});
	it('should download file if download button is clicked', async () => {
		const user = userEvent.setup();
		const mockContext = {
			folder: {
				files: [
					{
						id: '1',
						name: 'file',
						type: 'type',
						size: 123,
						createdAt: new Date(),
					},
				],
			},
			downloading: false,
			onResetSVGAnimate: vi.fn(),
		};

		const fileId = '1';

		supabase.auth.getSession.mockResolvedValueOnce({
			data: {
				session: { access_token: '' },
			},
		});

		handleFetch.mockResolvedValueOnce({
			success: true,
			data: { url: '' },
		});
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
							path: 'file-info/:fileId',
							element: <FileInfo />,
						},
					],
				},
			],
			{ initialEntries: [`/drive/file-info/${fileId}`] },
		);

		render(<RouterProvider router={router} />);

		const downloadBtn = screen.getByRole('button', { name: 'Download' });

		await user.click(downloadBtn);

		expect(mockContext.onResetSVGAnimate).toBeCalledTimes(1);
		expect(mockElement.click).toBeCalledTimes(1);
	});
});
