import { expect, describe, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { RouterProvider, createMemoryRouter, Outlet } from 'react-router-dom';
import { Context as ResponsiveContext } from 'react-responsive';

import { Subfolders } from '../../../../../components/pages/Drive/Folder/Subfolder/Subfolders';

describe('Subfolders component', () => {
	it('should render subfolders if the array of subfolders prop is not empty', async () => {
		const mockContext = {
			folders: [],
			menu: {
				id: '',
				name: '',
			},

			onActiveMenu: vi.fn(),
			onActiveModal: vi.fn(),
			onUpdateFolder: vi.fn(),
			onResetSVGAnimate: vi.fn(),
		};

		const mockProps = {
			subfolders: [
				{
					id: '1',
					name: 'folder',
					createdAt: new Date(),
				},
			],
		};

		const router = createMemoryRouter([
			{
				path: '/',
				element: <Outlet context={{ ...mockContext }} />,
				children: [
					{
						index: true,
						element: <Subfolders {...mockProps} />,
					},
				],
			},
		]);

		render(<RouterProvider router={router} />);

		const folderName = screen.getByText(mockProps.subfolders[0].name);

		expect(folderName).toBeInTheDocument();
	});
	it('should active options menu if options button is clicked', async () => {
		const user = userEvent.setup();
		const mockContext = {
			folders: [],
			menu: {
				id: '',
				name: '',
			},
			onActiveMenu: vi.fn(),
			onActiveModal: vi.fn(),
			onUpdateFolder: vi.fn(),
			onResetSVGAnimate: vi.fn(),
		};

		const mockProps = {
			subfolders: [
				{
					id: '1',
					name: 'folder',
					createdAt: new Date(),
				},
			],
		};

		const router = createMemoryRouter([
			{
				path: '/',
				element: <Outlet context={{ ...mockContext }} />,
				children: [
					{
						index: true,
						element: <Subfolders {...mockProps} />,
					},
				],
			},
		]);

		render(<RouterProvider router={router} />);

		const optionsButton = screen.getByTitle('options-button');

		await user.click(optionsButton);

		expect(mockContext.onActiveMenu).toBeCalledWith({
			id: mockProps.subfolders[0].id,
			button: 'options-button',
			name: 'options-menu',
		});
	});
	it(`should render calendar icon if the user's device screen is smaller than 700 pixels`, async () => {
		const mockContext = {
			folders: [],
			menu: {
				id: '',
				name: '',
			},
			onActiveMenu: vi.fn(),
			onActiveModal: vi.fn(),
			onUpdateFolder: vi.fn(),
			onResetSVGAnimate: vi.fn(),
		};

		const mockProps = {
			subfolders: [
				{
					id: '1',
					name: 'folder',
					createdAt: new Date(),
				},
			],
		};

		const router = createMemoryRouter([
			{
				path: '/',
				element: <Outlet context={{ ...mockContext }} />,
				children: [
					{
						index: true,
						element: (
							<ResponsiveContext.Provider value={{ width: 600 }}>
								<Subfolders {...mockProps} />
							</ResponsiveContext.Provider>
						),
					},
				],
			},
		]);

		render(<RouterProvider router={router} />);

		const calendarIcon = screen.getByTestId('calendar-icon');

		expect(calendarIcon).toBeInTheDocument();
	});
	it(`should render head titles if the user's device screen is wider than 700 pixels`, async () => {
		const mockContext = {
			folders: [],
			menu: {
				id: '',
				name: '',
			},
			onActiveMenu: vi.fn(),
			onActiveModal: vi.fn(),
			onUpdateFolder: vi.fn(),
			onResetSVGAnimate: vi.fn(),
		};

		const mockProps = {
			subfolders: [
				{
					id: '1',
					name: 'folder',
					createdAt: new Date(),
				},
			],
		};

		const router = createMemoryRouter([
			{
				path: '/',
				element: <Outlet context={{ ...mockContext }} />,
				children: [
					{
						index: true,
						element: (
							<ResponsiveContext.Provider value={{ width: 700 }}>
								<Subfolders {...mockProps} />
							</ResponsiveContext.Provider>
						),
					},
				],
			},
		]);

		render(<RouterProvider router={router} />);

		const name = screen.getByText('Name');
		const createdAt = screen.getByText('Created At');

		expect(name).toBeInTheDocument();
		expect(createdAt).toBeInTheDocument();
	});
	it('should show update folder modal if rename button is clicked', async () => {
		const user = userEvent.setup();
		const mockContext = {
			folders: [],
			menu: {
				id: '1',
				name: 'options-menu',
			},
			onActiveMenu: vi.fn(),
			onActiveModal: vi.fn(),
			onUpdateFolder: vi.fn(),
			onResetSVGAnimate: vi.fn(),
		};

		const mockProps = {
			subfolders: [
				{
					id: '1',
					name: 'folder',
					createdAt: new Date(),
				},
			],
		};

		const router = createMemoryRouter([
			{
				path: '/',
				element: <Outlet context={{ ...mockContext }} />,
				children: [
					{
						index: true,
						element: <Subfolders {...mockProps} />,
					},
				],
			},
		]);

		render(<RouterProvider router={router} />);

		const renameBtn = screen.getByRole('button', { name: 'Rename' });

		await user.click(renameBtn);

		expect(mockContext.onActiveModal).toBeCalledTimes(1);
	});
	it('should show delete folder modal if remove button is clicked', async () => {
		const user = userEvent.setup();
		const mockContext = {
			folders: [],
			menu: {
				id: '1',
				name: 'options-menu',
			},
			onActiveMenu: vi.fn(),
			onActiveModal: vi.fn(),
			onUpdateFolder: vi.fn(),
			onResetSVGAnimate: vi.fn(),
		};

		const mockProps = {
			subfolders: [
				{
					id: '1',
					name: 'folder',
					createdAt: new Date(),
				},
			],
		};

		const router = createMemoryRouter([
			{
				path: '/',
				element: <Outlet context={{ ...mockContext }} />,
				children: [
					{
						index: true,
						element: <Subfolders {...mockProps} />,
					},
				],
			},
		]);

		render(<RouterProvider router={router} />);

		const removeBtn = screen.getByRole('button', { name: 'Remove' });

		await user.click(removeBtn);

		expect(mockContext.onActiveModal).toBeCalledTimes(1);
	});
});
