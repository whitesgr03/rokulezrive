import { expect, describe, it, vi } from 'vitest';
import {
	render,
	screen,
	waitForElementToBeRemoved,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
	RouterProvider,
	createMemoryRouter,
	Outlet,
	useOutletContext,
} from 'react-router-dom';
import { Context as ResponsiveContext } from 'react-responsive';
import { supabase } from '../../../utils/supabase_client';
import { handleFetch } from '../../../utils/handle_fetch';

import { Drive } from '../../../components/pages/Drive/Drive';
import { UploadList } from '../../../components/pages/Drive/Upload_List';
import { Navbar } from '../../../components/layout/Navbar/Navbar';
import { Footer } from '../../../components/layout/Footer/Footer';

vi.mock('../../../utils/supabase_client');
vi.mock('../../../utils/handle_fetch');
vi.mock('../../../components/pages/Drive/Upload_List');
vi.mock('../../../components/layout/Navbar/Navbar');
vi.mock('../../../components/layout/Footer/Footer');

describe('Drive component', () => {
	it(`should render default folder name if url path is '/drive'`, async () => {
		const mockContext = {
			menu: {
				name: '',
			},
			onActiveMenu: vi.fn(),
			onActiveModal: vi.fn(),
		};

		supabase.auth.getSession.mockResolvedValueOnce({
			data: {
				session: { access_token: '' },
			},
		});

		handleFetch
			.mockResolvedValueOnce({
				success: true,
				data: [],
			})
			.mockResolvedValueOnce({
				success: true,
				data: [
					{
						id: '1',
						name: 'folder name',
					},
				],
			});

		const router = createMemoryRouter(
			[
				{
					path: '/drive',
					element: <Outlet context={{ ...mockContext }} />,
					children: [
						{
							index: true,
							element: <Drive />,
						},
					],
				},
			],
			{ initialEntries: ['/drive'] },
		);

		render(<RouterProvider router={router} />);

		await waitForElementToBeRemoved(() => screen.getByText(/loading/i));

		const folderName = screen.getByText('folder name');

		expect(folderName).toBeInTheDocument();
	});
	it(`should navigate to '/error' path if fetch folders or shared files fails`, async () => {
		const mockContext = {
			menu: {
				name: '',
			},
			onActiveMenu: vi.fn(),
			onActiveModal: vi.fn(),
		};

		supabase.auth.getSession.mockResolvedValueOnce({
			data: {
				session: { access_token: '' },
			},
		});

		handleFetch.mockResolvedValue({
			success: false,
			message: 'error',
		});

		const router = createMemoryRouter([
			{
				path: '/',
				element: <Outlet context={{ ...mockContext }} />,
				children: [
					{
						index: true,
						element: <Drive />,
					},
				],
			},
			{ path: '/error', element: <p>Error page</p> },
		]);

		render(<RouterProvider router={router} />);

		const errorPage = await screen.findByText('Error page');

		expect(errorPage).toBeInTheDocument();
	});
	it(`should show up to 2 levels of folder paths, including the current folder when the user is viewing file and the user's device screen is smaller than 700 pixels.`, async () => {
		const mockContext = {
			menu: {
				name: '',
			},
			onActiveMenu: vi.fn(),
			onActiveModal: vi.fn(),
		};

		supabase.auth.getSession.mockResolvedValueOnce({
			data: {
				session: { access_token: '' },
			},
		});

		const mockFolders = [
			{
				id: '1',
				name: 'default folder',
				parent: null,
			},
		];

		handleFetch
			.mockResolvedValueOnce({
				success: true,
				data: [],
			})
			.mockResolvedValueOnce({
				success: true,
				data: mockFolders,
			});

		const router = createMemoryRouter(
			[
				{
					path: '/drive',
					element: <Outlet context={{ ...mockContext }} />,
					children: [
						{
							path: 'files/:fileId',
							element: (
								<ResponsiveContext.Provider value={{ width: 600 }}>
									<Drive />
								</ResponsiveContext.Provider>
							),
						},
					],
				},
			],
			{ initialEntries: ['/drive/files/1'] },
		);

		render(<RouterProvider router={router} />);

		await waitForElementToBeRemoved(() => screen.getByText(/loading/i));

		const path = screen.getByRole('link', { name: mockFolders[0].name });
		expect(path).toBeInTheDocument();
	});
	it(`should display up to 2 levels of folder paths when the user is in a subfolder at any level and the user's device screen is smaller than 700 pixels.`, async () => {
		const mockContext = {
			menu: {
				name: '',
			},
			onActiveMenu: vi.fn(),
			onActiveModal: vi.fn(),
		};

		supabase.auth.getSession.mockResolvedValueOnce({
			data: {
				session: { access_token: '' },
			},
		});

		const mockFolders = [
			{
				id: '1',
				name: 'default folder',
				parent: null,
			},
			{
				id: '2',
				name: 'second folder',
				parent: {
					id: '1',
				},
			},
			{
				id: '3',
				name: 'third folder',
				parent: {
					id: '2',
				},
			},
		];

		handleFetch
			.mockResolvedValueOnce({
				success: true,
				data: [],
			})
			.mockResolvedValueOnce({
				success: true,
				data: mockFolders,
			});

		const router = createMemoryRouter(
			[
				{
					path: '/drive',
					element: <Outlet context={{ ...mockContext }} />,
					children: [
						{
							path: 'folders/:folderId/files/:fileId',
							element: (
								<ResponsiveContext.Provider value={{ width: 600 }}>
									<Drive />
								</ResponsiveContext.Provider>
							),
						},
					],
				},
			],
			{ initialEntries: ['/drive/folders/3/files/1'] },
		);

		render(<RouterProvider router={router} />);

		await waitForElementToBeRemoved(() => screen.getByText(/loading/i));

		mockFolders.slice(-2).forEach(folder => {
			const path = screen.getByRole('link', { name: folder.name });
			expect(path).toBeInTheDocument();
		});
	});
	it(`should display up to 3 levels of folder paths when the user is in a subfolder at any level and the user's device screen is wider than 700 pixels.`, async () => {
		const mockContext = {
			menu: {
				name: '',
			},
			onActiveMenu: vi.fn(),
			onActiveModal: vi.fn(),
		};

		supabase.auth.getSession.mockResolvedValueOnce({
			data: {
				session: { access_token: '' },
			},
		});

		const mockFolders = [
			{
				id: '1',
				name: 'default folder',
				parent: null,
			},
			{
				id: '2',
				name: 'second folder',
				parent: {
					id: '1',
				},
			},
			{
				id: '3',
				name: 'third folder',
				parent: {
					id: '2',
				},
			},
			{
				id: '4',
				name: 'fourth folder',
				parent: {
					id: '3',
				},
			},
		];

		handleFetch
			.mockResolvedValueOnce({
				success: true,
				data: [],
			})
			.mockResolvedValueOnce({
				success: true,
				data: mockFolders,
			});

		const router = createMemoryRouter(
			[
				{
					path: '/drive',
					element: <Outlet context={{ ...mockContext }} />,
					children: [
						{
							path: ':folderId',
							element: (
								<ResponsiveContext.Provider value={{ width: 700 }}>
									<Drive />
								</ResponsiveContext.Provider>
							),
						},
					],
				},
			],
			{ initialEntries: ['/drive/4'] },
		);

		render(<RouterProvider router={router} />);

		await waitForElementToBeRemoved(() => screen.getByText(/loading/i));

		mockFolders.slice(-3).forEach(folder => {
			const path = screen.getByRole('link', { name: folder.name });
			expect(path).toBeInTheDocument();
		});
	});
	it(`should display up to 4 levels of folder paths when the user is in a subfolder at any level and the user's device screen is wider than 1024 pixels.`, async () => {
		const mockContext = {
			menu: {
				name: '',
			},
			onActiveMenu: vi.fn(),
			onActiveModal: vi.fn(),
		};

		supabase.auth.getSession.mockResolvedValueOnce({
			data: {
				session: { access_token: '' },
			},
		});

		const mockFolders = [
			{
				id: '1',
				name: 'default folder',
				parent: null,
			},
			{
				id: '2',
				name: 'second folder',
				parent: {
					id: '1',
				},
			},
			{
				id: '3',
				name: 'third folder',
				parent: {
					id: '2',
				},
			},
			{
				id: '4',
				name: 'fourth folder',
				parent: {
					id: '3',
				},
			},
			{
				id: '5',
				name: 'fifth folder',
				parent: {
					id: '4',
				},
			},
		];

		handleFetch
			.mockResolvedValueOnce({
				success: true,
				data: [],
			})
			.mockResolvedValueOnce({
				success: true,
				data: mockFolders,
			});

		const router = createMemoryRouter(
			[
				{
					path: '/drive',
					element: <Outlet context={{ ...mockContext }} />,
					children: [
						{
							path: ':folderId',
							element: (
								<ResponsiveContext.Provider value={{ width: 1024 }}>
									<Drive />
								</ResponsiveContext.Provider>
							),
						},
					],
				},
			],
			{ initialEntries: ['/drive/5'] },
		);

		render(<RouterProvider router={router} />);

		await waitForElementToBeRemoved(() => screen.getByText(/loading/i));

		mockFolders.slice(-4).forEach(folder => {
			const path = screen.getByRole('link', { name: folder.name });
			expect(path).toBeInTheDocument();
		});
	});
	it(`should render sidebar and footer components if the user's device screen is wider than 700 pixels`, async () => {
		const mockContext = {
			menu: {
				name: '',
			},
			onActiveMenu: vi.fn(),
			onActiveModal: vi.fn(),
		};

		supabase.auth.getSession.mockResolvedValueOnce({
			data: {
				session: { access_token: '' },
			},
		});

		const mockFolders = [
			{
				id: '1',
				name: 'default folder',
				parent: null,
			},
		];

		handleFetch
			.mockResolvedValueOnce({
				success: true,
				data: [],
			})
			.mockResolvedValueOnce({
				success: true,
				data: mockFolders,
			});

		UploadList.mockImplementation(() => <p>UploadList component</p>);
		Navbar.mockImplementation(() => <p>Navbar component</p>);
		Footer.mockImplementation(() => <p>Footer component</p>);

		const router = createMemoryRouter([
			{
				path: '/',
				element: <Outlet context={{ ...mockContext }} />,
				children: [
					{
						index: true,
						element: (
							<ResponsiveContext.Provider value={{ width: 700 }}>
								<Drive />
							</ResponsiveContext.Provider>
						),
					},
				],
			},
		]);

		render(<RouterProvider router={router} />);

		await waitForElementToBeRemoved(() => screen.getByText(/loading/i));

		const uploadList = screen.getByText('UploadList component');
		const navbar = screen.getByText('Navbar component');
		const footer = screen.getByText('Footer component');

		expect(uploadList).toBeInTheDocument();
		expect(navbar).toBeInTheDocument();
		expect(footer).toBeInTheDocument();
	});
	it(`should render upload button if the user's device screen is smaller than 700 pixels`, async () => {
		const mockContext = {
			menu: {
				name: '',
			},
			onActiveMenu: vi.fn(),
			onActiveModal: vi.fn(),
		};

		supabase.auth.getSession.mockResolvedValueOnce({
			data: {
				session: { access_token: '' },
			},
		});

		const mockFolders = [
			{
				id: '1',
				name: 'default folder',
				parent: null,
			},
		];

		handleFetch
			.mockResolvedValueOnce({
				success: true,
				data: [],
			})
			.mockResolvedValueOnce({
				success: true,
				data: mockFolders,
			});

		UploadList.mockImplementation(() => <p>UploadList component</p>);
		Navbar.mockImplementation(() => <p>Navbar component</p>);
		Footer.mockImplementation(() => <p>Footer component</p>);

		const router = createMemoryRouter([
			{
				path: '/',
				element: <Outlet context={{ ...mockContext }} />,
				children: [
					{
						index: true,
						element: (
							<ResponsiveContext.Provider value={{ width: 600 }}>
								<Drive />
							</ResponsiveContext.Provider>
						),
					},
				],
			},
		]);

		render(<RouterProvider router={router} />);

		await waitForElementToBeRemoved(() => screen.getByText(/loading/i));

		const button = screen.getByTitle('upload-button');

		expect(button).toBeInTheDocument();
	});
	it('should active upload menu if upload button is clicked', async () => {
		const user = userEvent.setup();
		const mockContext = {
			menu: {
				name: 'upload-menu',
			},
			onActiveMenu: vi.fn(),
			onActiveModal: vi.fn(),
		};

		supabase.auth.getSession.mockResolvedValueOnce({
			data: {
				session: { access_token: '' },
			},
		});

		const mockFolders = [
			{
				id: '1',
				name: 'default folder',
			},
		];

		handleFetch
			.mockResolvedValueOnce({
				success: true,
				data: [],
			})
			.mockResolvedValueOnce({
				success: true,
				data: mockFolders,
			});

		UploadList.mockImplementation(() => <p>UploadList component</p>);

		const router = createMemoryRouter([
			{
				path: '/',
				element: <Outlet context={{ ...mockContext }} />,
				children: [
					{
						index: true,
						element: (
							<ResponsiveContext.Provider value={{ width: 600 }}>
								<Drive />
							</ResponsiveContext.Provider>
						),
					},
				],
			},
		]);

		render(<RouterProvider router={router} />);

		await waitForElementToBeRemoved(() => screen.getByText(/loading/i));

		const button = screen.getByTitle('upload-button');

		await user.click(button);

		const uploadList = screen.getByText('UploadList component');

		expect(mockContext.onActiveMenu).toBeCalledTimes(1);
		expect(uploadList).toBeInTheDocument();
	});
	it('should create a new folder if "handleCreateFolder" is executed', async () => {
		const user = userEvent.setup();
		const mockContext = {
			menu: {
				name: 'upload-menu',
			},
			onActiveMenu: vi.fn(),
			onActiveModal: vi.fn(),
		};

		supabase.auth.getSession.mockResolvedValueOnce({
			data: {
				session: { access_token: '' },
			},
		});

		const mockFolders = [
			{
				id: '1',
				name: 'default folder',
			},
		];

		const mockNewFolder = {
			id: '2',
			name: 'second folder',
		};

		handleFetch
			.mockResolvedValueOnce({
				success: true,
				data: [],
			})
			.mockResolvedValueOnce({
				success: true,
				data: mockFolders,
			});

		UploadList.mockImplementation(({ onCreateFolder }) => (
			<button
				onClick={() =>
					onCreateFolder({
						currentFolder: mockFolders[0],
						newFolder: mockNewFolder,
					})
				}
			>
				Create folder button
			</button>
		));

		const DriveChildren = () => {
			const { folders } = useOutletContext();
			return (
				<ul>
					{folders.map(folder => (
						<li key={folder.id}>{folder.name}</li>
					))}
				</ul>
			);
		};

		const router = createMemoryRouter([
			{
				path: '/',
				element: <Outlet context={{ ...mockContext }} />,
				children: [
					{
						path: '/',
						element: (
							<ResponsiveContext.Provider value={{ width: 700 }}>
								<Drive />
							</ResponsiveContext.Provider>
						),
						children: [
							{
								index: true,
								element: <DriveChildren />,
							},
						],
					},
				],
			},
		]);

		render(<RouterProvider router={router} />);

		await waitForElementToBeRemoved(() => screen.getByText(/loading/i));

		const createFolderButton = screen.getByRole('button', {
			name: 'Create folder button',
		});

		await user.click(createFolderButton);

		const listItems = screen.getAllByRole('listitem');

		expect(listItems).toHaveLength(2);
	});
	it('should update a specified folder if "handleUpdateFolder" is executed', async () => {
		const user = userEvent.setup();
		const mockContext = {
			menu: {
				name: 'upload-menu',
			},
			onActiveMenu: vi.fn(),
			onActiveModal: vi.fn(),
		};

		supabase.auth.getSession.mockResolvedValueOnce({
			data: {
				session: { access_token: '' },
			},
		});

		const mockFolders = [
			{
				id: '1',
				name: 'default folder',
			},
		];

		const mockData = {
			currentFolder: {
				...mockFolders[0],
				name: 'new folder',
			},
		};

		handleFetch
			.mockResolvedValueOnce({
				success: true,
				data: [],
			})
			.mockResolvedValueOnce({
				success: true,
				data: mockFolders,
			});

		UploadList.mockImplementation(({ onUpdateFolder }) => (
			<button onClick={() => onUpdateFolder(mockData)}>
				Update folder button
			</button>
		));

		const DriveChildren = () => {
			const { folders } = useOutletContext();
			return (
				<ul>
					{folders.map(folder => (
						<li key={folder.id}>{folder.name}</li>
					))}
				</ul>
			);
		};

		const router = createMemoryRouter([
			{
				path: '/',
				element: <Outlet context={{ ...mockContext }} />,
				children: [
					{
						path: '/',
						element: (
							<ResponsiveContext.Provider value={{ width: 700 }}>
								<Drive />
							</ResponsiveContext.Provider>
						),
						children: [
							{
								index: true,
								element: <DriveChildren />,
							},
						],
					},
				],
			},
		]);

		render(<RouterProvider router={router} />);

		await waitForElementToBeRemoved(() => screen.getByText(/loading/i));

		const updateFolderButton = screen.getByRole('button', {
			name: 'Update folder button',
		});

		await user.click(updateFolderButton);

		const listItems = screen.getAllByRole('listitem');

		expect(listItems[0]).toHaveTextContent(mockData.currentFolder.name);
	});
	it('should delete a specified folder if "handleDeleteFolder" is executed', async () => {
		const user = userEvent.setup();
		const mockContext = {
			menu: {
				name: '',
			},
			onActiveMenu: vi.fn(),
			onActiveModal: vi.fn(),
		};

		supabase.auth.getSession.mockResolvedValueOnce({
			data: {
				session: { access_token: '' },
			},
		});

		const mockFolders = [
			{
				id: '1',
				name: 'default folder',
			},
			{
				id: '2',
				name: 'second folder',
			},
		];

		const mockData = {
			currentFolder: {
				id: '1',
				name: 'default folder',
			},
			deleteFolderId: '2',
		};

		handleFetch
			.mockResolvedValueOnce({
				success: true,
				data: [],
			})
			.mockResolvedValueOnce({
				success: true,
				data: mockFolders,
			});

		const DriveChildren = () => {
			const { folders, onDeleteFolder } = useOutletContext();
			return (
				<>
					<button onClick={() => onDeleteFolder(mockData)}>
						Delete folder button
					</button>
					<ul>
						{folders.map(folder => (
							<li key={folder.id}>{folder.name}</li>
						))}
					</ul>
				</>
			);
		};

		const router = createMemoryRouter([
			{
				path: '/',
				element: <Outlet context={{ ...mockContext }} />,
				children: [
					{
						path: '/',
						element: (
							<ResponsiveContext.Provider value={{ width: 700 }}>
								<Drive />
							</ResponsiveContext.Provider>
						),
						children: [
							{
								index: true,
								element: <DriveChildren />,
							},
						],
					},
				],
			},
		]);

		render(<RouterProvider router={router} />);

		await waitForElementToBeRemoved(() => screen.getByText(/loading/i));

		const deleteFolderButton = screen.getByRole('button', {
			name: 'Delete folder button',
		});

		await user.click(deleteFolderButton);

		const listItems = screen.getAllByRole('listitem');

		expect(listItems).toHaveLength(1);
	});
	it('should delete a specified shared folder if "handleDeleteSharedFile" is executed', async () => {
		const user = userEvent.setup();
		const mockContext = {
			menu: {
				name: '',
			},
			onActiveMenu: vi.fn(),
			onActiveModal: vi.fn(),
		};

		supabase.auth.getSession.mockResolvedValueOnce({
			data: {
				session: { access_token: '' },
			},
		});

		const mockFolders = [
			{
				id: '1',
				name: 'default folder',
			},
		];

		const mockSharedFolders = [
			{
				file: { id: '1', name: 'default shared folder' },
			},
		];

		const mockData = {
			id: '1',
		};

		handleFetch
			.mockResolvedValueOnce({
				success: true,
				data: mockSharedFolders,
			})
			.mockResolvedValueOnce({
				success: true,
				data: mockFolders,
			});

		const DriveChildren = () => {
			const { sharedFiles, onDeleteSharedFile } = useOutletContext();
			return (
				<>
					<button onClick={() => onDeleteSharedFile(mockData.id)}>
						Delete shared file button
					</button>
					<ul>
						{sharedFiles.map(item => (
							<li key={item.file.id}>{item.file.name}</li>
						))}
					</ul>
				</>
			);
		};

		const router = createMemoryRouter([
			{
				path: '/',
				element: <Outlet context={{ ...mockContext }} />,
				children: [
					{
						path: '/',
						element: <Drive />,
						children: [
							{
								index: true,
								element: <DriveChildren />,
							},
						],
					},
				],
			},
		]);

		render(<RouterProvider router={router} />);

		await waitForElementToBeRemoved(() => screen.getByText(/loading/i));

		const deleteSharedFileButton = screen.getByRole('button', {
			name: 'Delete shared file button',
		});

		await user.click(deleteSharedFileButton);

		const listItems = screen.queryAllByRole('listitem');

		expect(listItems).toHaveLength(0);
	});
});
