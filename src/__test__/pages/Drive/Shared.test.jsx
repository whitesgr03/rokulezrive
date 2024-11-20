import { expect, describe, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { RouterProvider, createMemoryRouter, Outlet } from 'react-router-dom';
import { Context as ResponsiveContext } from 'react-responsive';
import { supabase } from '../../../utils/supabase_client';
import { handleFetch, handleFetchBlob } from '../../../utils/handle_fetch';
import { createDownloadElement } from '../../../utils/create_download_element';

import { Shared } from '../../../components/pages/Drive/Shared';

vi.mock('../../../utils/supabase_client');
vi.mock('../../../utils/handle_fetch');
vi.mock('../../../utils/create_download_element');

describe('Shared component', () => {
	it(`should render a message if shared files are not provided and the path is '/drive/shared'`, () => {
		const mockContext = {
			sharedFiles: [],
			menu: {
				id: '',
				name: '',
			},
			downloading: '',
			onActiveMenu: vi.fn(),
			onActiveModal: vi.fn(),
			onDeleteSharedFile: vi.fn(),
			onResetSVGAnimate: vi.fn(),
		};

		const router = createMemoryRouter(
			[
				{
					path: '/drive/shared',
					element: <Outlet context={{ ...mockContext }} />,
					children: [
						{
							index: true,
							element: <Shared />,
						},
					],
				},
			],
			{ initialEntries: [`/drive/shared`] },
		);

		render(<RouterProvider router={router} />);

		const message = screen.getByText('There are not files shared with you');

		expect(message).toBeInTheDocument();
	});
	it('should active options menu if options button is clicked', async () => {
		const user = userEvent.setup();
		const mockContext = {
			sharedFiles: [
				{
					file: {
						id: '1',
						type: 'image',
						name: 'shared file',
						owner: {
							email: 'email@email.com',
						},
					},
					sharedAt: new Date(),
				},
			],
			menu: {
				id: '',
				name: '',
			},
			downloading: '',
			onActiveMenu: vi.fn(),
			onActiveModal: vi.fn(),
			onDeleteSharedFile: vi.fn(),
			onResetSVGAnimate: vi.fn(),
		};

		const router = createMemoryRouter(
			[
				{
					path: '/drive',
					element: <Outlet context={{ ...mockContext }} />,
					children: [
						{
							index: true,
							element: <Shared />,
						},
					],
				},
			],
			{ initialEntries: [`/drive`] },
		);

		render(<RouterProvider router={router} />);

		const optionsButton = screen.getByTitle('options-button');

		await user.click(optionsButton);

		expect(mockContext.onActiveMenu).toBeCalledWith({
			id: mockContext.sharedFiles[0].file.id,
			button: 'options-button',
			name: 'options-menu',
		});
	});
	it(`should render sharer and calendar icons if the user's device screen is smaller than 700 pixels`, () => {
		const mockContext = {
			sharedFiles: [
				{
					file: {
						id: '1',
						type: 'image',
						name: 'shared file',
						owner: {
							email: 'email@email.com',
						},
					},
					sharedAt: new Date(),
				},
			],
			menu: {
				id: '',
				name: '',
			},
			downloading: '',
			onActiveMenu: vi.fn(),
			onActiveModal: vi.fn(),
			onDeleteSharedFile: vi.fn(),
			onResetSVGAnimate: vi.fn(),
		};

		const router = createMemoryRouter(
			[
				{
					path: '/drive',
					element: <Outlet context={{ ...mockContext }} />,
					children: [
						{
							index: true,
							element: (
								<ResponsiveContext.Provider value={{ width: 600 }}>
									<Shared />
								</ResponsiveContext.Provider>
							),
						},
					],
				},
			],
			{ initialEntries: [`/drive`] },
		);

		render(<RouterProvider router={router} />);

		const sharerIcon = screen.getByTestId('sharer');
		const calendarIcon = screen.getByTestId('calendar');

		expect(sharerIcon).toBeInTheDocument();
		expect(calendarIcon).toBeInTheDocument();
	});
	it(`should render head titles if the user's device screen is wider than 700 pixels`, () => {
		const mockContext = {
			sharedFiles: [
				{
					file: {
						id: '1',
						type: 'image',
						name: 'shared file',
						owner: {
							email: 'email@email.com',
						},
					},
					sharedAt: new Date(),
				},
			],
			menu: {
				id: '',
				name: '',
			},
			downloading: '',
			onActiveMenu: vi.fn(),
			onActiveModal: vi.fn(),
			onDeleteSharedFile: vi.fn(),
			onResetSVGAnimate: vi.fn(),
		};

		const router = createMemoryRouter(
			[
				{
					path: '/drive',
					element: <Outlet context={{ ...mockContext }} />,
					children: [
						{
							index: true,
							element: (
								<ResponsiveContext.Provider value={{ width: 700 }}>
									<Shared />
								</ResponsiveContext.Provider>
							),
						},
					],
				},
			],
			{ initialEntries: [`/drive`] },
		);

		render(<RouterProvider router={router} />);

		const name = screen.getByText('Name');
		const sharedBy = screen.getByText('Shared By');
		const sharedAt = screen.getByText('Shared At');

		expect(name).toBeInTheDocument();
		expect(sharedBy).toBeInTheDocument();
		expect(sharedAt).toBeInTheDocument();
	});
	it('should navigate to "/drive/error" path if get resource url is fails', async () => {
		const user = userEvent.setup();
		const mockContext = {
			sharedFiles: [
				{
					file: {
						id: '1',
						type: 'image',
						name: 'shared file',
						owner: {
							email: 'email@email.com',
						},
					},
					sharedAt: new Date(),
				},
			],
			menu: {
				id: '1',
				name: 'options-menu',
			},
			downloading: '',
			onActiveMenu: vi.fn(),
			onActiveModal: vi.fn(),
			onDeleteSharedFile: vi.fn(),
			onResetSVGAnimate: vi.fn(),
		};

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
							index: true,
							element: <Shared />,
						},
						{
							path: 'error',
							element: <p>Error page</p>,
						},
					],
				},
			],
			{ initialEntries: [`/drive`] },
		);

		render(<RouterProvider router={router} />);

		screen.debug();

		const downloadButton = screen.getByRole('button', { name: 'Download' });

		await user.click(downloadButton);

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
						type: 'image',
						name: 'shared file',
						owner: {
							email: 'email@email.com',
						},
					},
					sharedAt: new Date(),
				},
			],
			menu: {
				id: '1',
				name: 'options-menu',
			},
			downloading: '',
			onActiveMenu: vi.fn(),
			onActiveModal: vi.fn(),
			onDeleteSharedFile: vi.fn(),
			onResetSVGAnimate: vi.fn(),
		};

		supabase.auth.getSession.mockResolvedValueOnce({
			data: {
				session: { access_token: '' },
			},
		});

		handleFetch.mockResolvedValueOnce({
			success: true,
			data: { url: '' },
		});

		handleFetchBlob.mockResolvedValueOnce({ success: false });

		const router = createMemoryRouter(
			[
				{
					path: '/drive',
					element: <Outlet context={{ ...mockContext }} />,
					children: [
						{
							index: true,
							element: <Shared />,
						},
						{
							path: 'error',
							element: <p>Error page</p>,
						},
					],
				},
			],
			{ initialEntries: [`/drive`] },
		);

		render(<RouterProvider router={router} />);

		const downloadButton = screen.getByRole('button', { name: 'Download' });

		await user.click(downloadButton);

		const errorMessage = screen.getByText('Error page');

		expect(errorMessage).toBeInTheDocument();
	});
	it('should download file if download button is clicked', async () => {
		const user = userEvent.setup();
		const mockContext = {
			sharedFiles: [
				{
					file: {
						id: '1',
						type: 'image',
						name: 'shared file',
						owner: {
							email: 'email@email.com',
						},
					},
					sharedAt: new Date(),
				},
			],
			menu: {
				id: '1',
				name: 'options-menu',
			},
			downloading: '',
			onActiveMenu: vi.fn(),
			onActiveModal: vi.fn(),
			onDeleteSharedFile: vi.fn(),
			onResetSVGAnimate: vi.fn(),
		};

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
							index: true,
							element: <Shared />,
						},
					],
				},
			],
			{ initialEntries: [`/drive`] },
		);

		render(<RouterProvider router={router} />);

		const downloadButton = screen.getByRole('button', { name: 'Download' });

		await user.click(downloadButton);

		expect(mockContext.onResetSVGAnimate).toBeCalledTimes(1);
		expect(mockContext.onActiveMenu).toBeCalledTimes(1);
		expect(mockElement.click).toBeCalledTimes(1);
	});
	it('should show shared delete modal if unshare button is clicked', async () => {
		const user = userEvent.setup();
		const mockContext = {
			sharedFiles: [
				{
					file: {
						id: '1',
						type: 'image',
						name: 'shared file',
						owner: {
							email: 'email@email.com',
						},
					},
					sharedAt: new Date(),
				},
			],
			menu: {
				id: '1',
				name: 'options-menu',
			},
			downloading: '',
			onActiveMenu: vi.fn(),
			onActiveModal: vi.fn(),
			onDeleteSharedFile: vi.fn(),
			onResetSVGAnimate: vi.fn(),
		};

		const router = createMemoryRouter(
			[
				{
					path: '/drive',
					element: <Outlet context={{ ...mockContext }} />,
					children: [
						{
							index: true,
							element: <Shared />,
						},
					],
				},
			],
			{ initialEntries: [`/drive`] },
		);

		render(<RouterProvider router={router} />);

		const unshareBtn = screen.getByRole('button', { name: 'Unshare' });

		await user.click(unshareBtn);

		expect(mockContext.onActiveModal).toBeCalledTimes(1);
	});
});
