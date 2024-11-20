import { expect, describe, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { RouterProvider, createMemoryRouter, Outlet } from 'react-router-dom';
import { supabase } from '../../../../../utils/supabase_client';
import { Context as ResponsiveContext } from 'react-responsive';
import {
	handleFetch,
	handleFetchBlob,
} from '../../../../../utils/handle_fetch';
import { createDownloadElement } from '../../../../../utils/create_download_element';
import { formatBytes } from '../../../../../utils/format_bytes';

import { Files } from '../../../../../components/pages/Drive/Folder/File/Files';

vi.mock('../../../../../utils/supabase_client');
vi.mock('../../../../../utils/handle_fetch');
vi.mock('../../../../../utils/create_download_element');
vi.mock('../../../../../utils/format_bytes');

describe('Files component', () => {
	it('should render files if the array of files prop is not empty', async () => {
		const mockContext = {
			menu: {
				id: '',
				name: '',
			},
			downloading: '',
			onActiveMenu: vi.fn(),
			onActiveModal: vi.fn(),
			onUpdateFolder: vi.fn(),
			onResetSVGAnimate: vi.fn(),
		};

		const mockProps = {
			files: [
				{
					id: '1',
					type: 'image',
					name: 'file',
					size: 10,
					createdAt: new Date(),
					sharers: [],
					public: false,
				},
			],
		};

		const router = createMemoryRouter(
			[
				{
					path: '/drive',
					element: <Outlet context={{ ...mockContext }} />,
					children: [
						{
							index: true,
							element: <Files {...mockProps} />,
						},
					],
				},
			],
			{ initialEntries: [`/drive`] },
		);

		render(<RouterProvider router={router} />);

		const nameFile = screen.getByText(mockProps.files[0].name);

		expect(nameFile).toBeInTheDocument();
		expect(formatBytes).toBeCalledWith(mockProps.files[0].size);
	});
	it('should active options menu if options button is clicked', async () => {
		const user = userEvent.setup();
		const mockContext = {
			menu: {
				id: '',
				name: '',
			},
			downloading: '',
			onActiveMenu: vi.fn(),
			onActiveModal: vi.fn(),
			onUpdateFolder: vi.fn(),
			onResetSVGAnimate: vi.fn(),
		};

		const mockProps = {
			files: [
				{
					id: '1',
					type: 'image',
					name: 'file',
					size: 10,
					createdAt: new Date(),
					sharers: [],
					public: false,
				},
			],
		};

		const router = createMemoryRouter(
			[
				{
					path: '/drive',
					element: <Outlet context={{ ...mockContext }} />,
					children: [
						{
							index: true,
							element: <Files {...mockProps} />,
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
			id: mockProps.files[0].id,
			button: 'options-button',
			name: 'options-menu',
		});
	});
	it(`should render size and calendar icons if the user's device screen is smaller than 700 pixels`, () => {
		const mockContext = {
			menu: {
				id: '',
				name: '',
			},
			downloading: '',
			onActiveMenu: vi.fn(),
			onActiveModal: vi.fn(),
			onUpdateFolder: vi.fn(),
			onResetSVGAnimate: vi.fn(),
		};

		const mockProps = {
			files: [
				{
					id: '1',
					type: 'image',
					name: 'file',
					size: 10,
					createdAt: new Date(),
					sharers: [],
					public: false,
				},
			],
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
									<Files {...mockProps} />
								</ResponsiveContext.Provider>
							),
						},
					],
				},
			],
			{ initialEntries: [`/drive`] },
		);

		render(<RouterProvider router={router} />);

		const sizeIcon = screen.getByTestId('size');
		const calendarIcon = screen.getByTestId('calendar');

		expect(sizeIcon).toBeInTheDocument();
		expect(calendarIcon).toBeInTheDocument();
	});
	it(`should render head titles if the user's device screen is wider than 700 pixels`, () => {
		const mockContext = {
			menu: {
				id: '',
				name: '',
			},
			downloading: '',
			onActiveMenu: vi.fn(),
			onActiveModal: vi.fn(),
			onUpdateFolder: vi.fn(),
			onResetSVGAnimate: vi.fn(),
		};

		const mockProps = {
			files: [],
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
									<Files {...mockProps} />
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
		const size = screen.getByText('Size');
		const createdAt = screen.getByText('Created At');

		expect(name).toBeInTheDocument();
		expect(size).toBeInTheDocument();
		expect(createdAt).toBeInTheDocument();
	});
	it('should navigate to "/drive/error" path if get resource url is fails', async () => {
		const user = userEvent.setup();
		const mockContext = {
			menu: {
				id: '1',
				name: 'options-menu',
			},
			downloading: '',
			onActiveMenu: vi.fn(),
			onActiveModal: vi.fn(),
			onUpdateFolder: vi.fn(),
			onResetSVGAnimate: vi.fn(),
		};

		const mockProps = {
			files: [
				{
					id: '1',
					type: 'image',
					name: 'file',
					size: 10,
					createdAt: new Date(),
					sharers: [],
					public: false,
				},
			],
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
							element: <Files {...mockProps} />,
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

		const downloadBtn = screen.getByRole('button', { name: 'Download' });

		await user.click(downloadBtn);

		const errorMessage = screen.getByText('Error page');

		expect(errorMessage).toBeInTheDocument();
	});
	it('should navigate to "/drive/error" path if get resource blob is fails', async () => {
		const user = userEvent.setup();
		const mockContext = {
			menu: {
				id: '1',
				name: 'options-menu',
			},
			downloading: '',
			onActiveMenu: vi.fn(),
			onActiveModal: vi.fn(),
			onUpdateFolder: vi.fn(),
			onResetSVGAnimate: vi.fn(),
		};

		const mockProps = {
			files: [
				{
					id: '1',
					type: 'image',
					name: 'file',
					size: 10,
					createdAt: new Date(),
					sharers: [],
					public: false,
				},
			],
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
							element: <Files {...mockProps} />,
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

		const downloadBtn = screen.getByRole('button', { name: 'Download' });

		await user.click(downloadBtn);

		const errorMessage = screen.getByText('Error page');

		expect(errorMessage).toBeInTheDocument();
	});
	it('should download file if download button is clicked', async () => {
		const user = userEvent.setup();
		const mockContext = {
			menu: {
				id: '1',
				name: 'options-menu',
			},
			downloading: '',
			onActiveMenu: vi.fn(),
			onActiveModal: vi.fn(),
			onUpdateFolder: vi.fn(),
			onResetSVGAnimate: vi.fn(),
		};

		const mockProps = {
			files: [
				{
					id: '1',
					type: 'image',
					name: 'file',
					size: 10,
					createdAt: new Date(),
					sharers: [],
					public: false,
				},
			],
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
							element: <Files {...mockProps} />,
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

		const downloadBtn = screen.getByRole('button', { name: 'Download' });

		await user.click(downloadBtn);

		expect(mockContext.onResetSVGAnimate).toBeCalledTimes(1);
		expect(mockContext.onActiveMenu).toBeCalledTimes(1);
		expect(mockElement.click).toBeCalledTimes(1);
	});
	it('should show share file modal if share button is clicked', async () => {
		const user = userEvent.setup();
		const mockContext = {
			menu: {
				id: '1',
				name: 'options-menu',
			},
			downloading: '',
			onActiveMenu: vi.fn(),
			onActiveModal: vi.fn(),
			onUpdateFolder: vi.fn(),
			onResetSVGAnimate: vi.fn(),
		};

		const mockProps = {
			files: [
				{
					id: '1',
					type: 'image',
					name: 'file',
					size: 10,
					createdAt: new Date(),
					sharers: [],
					public: false,
				},
			],
		};

		const router = createMemoryRouter(
			[
				{
					path: '/drive',
					element: <Outlet context={{ ...mockContext }} />,
					children: [
						{
							index: true,
							element: <Files {...mockProps} />,
						},
					],
				},
			],
			{ initialEntries: [`/drive`] },
		);

		render(<RouterProvider router={router} />);

		const shareBtn = screen.getByRole('button', { name: 'Share' });

		await user.click(shareBtn);

		expect(mockContext.onActiveModal).toBeCalledTimes(1);
	});
	it('should show update file modal if rename button is clicked', async () => {
		const user = userEvent.setup();
		const mockContext = {
			menu: {
				id: '1',
				name: 'options-menu',
			},
			downloading: '',
			onActiveMenu: vi.fn(),
			onActiveModal: vi.fn(),
			onUpdateFolder: vi.fn(),
			onResetSVGAnimate: vi.fn(),
		};

		const mockProps = {
			files: [
				{
					id: '1',
					type: 'image',
					name: 'file',
					size: 10,
					createdAt: new Date(),
					sharers: [],
					public: false,
				},
			],
		};

		const router = createMemoryRouter(
			[
				{
					path: '/drive',
					element: <Outlet context={{ ...mockContext }} />,
					children: [
						{
							index: true,
							element: <Files {...mockProps} />,
						},
					],
				},
			],
			{ initialEntries: [`/drive`] },
		);

		render(<RouterProvider router={router} />);

		const renameBtn = screen.getByRole('button', { name: 'Rename' });

		await user.click(renameBtn);

		expect(mockContext.onActiveModal).toBeCalledTimes(1);
	});
	it('should show delete file modal if remove button is clicked', async () => {
		const user = userEvent.setup();
		const mockContext = {
			menu: {
				id: '1',
				name: 'options-menu',
			},
			downloading: '',
			onActiveMenu: vi.fn(),
			onActiveModal: vi.fn(),
			onUpdateFolder: vi.fn(),
			onResetSVGAnimate: vi.fn(),
		};

		const mockProps = {
			files: [
				{
					id: '1',
					type: 'image',
					name: 'file',
					size: 10,
					createdAt: new Date(),
					sharers: [],
					public: false,
				},
			],
		};

		const router = createMemoryRouter(
			[
				{
					path: '/drive',
					element: <Outlet context={{ ...mockContext }} />,
					children: [
						{
							index: true,
							element: <Files {...mockProps} />,
						},
					],
				},
			],
			{ initialEntries: [`/drive`] },
		);

		render(<RouterProvider router={router} />);

		const deleteBtn = screen.getByRole('button', { name: 'Remove' });

		await user.click(deleteBtn);

		expect(mockContext.onActiveModal).toBeCalledTimes(1);
	});
});
