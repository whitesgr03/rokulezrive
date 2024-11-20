import { expect, describe, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { RouterProvider, createMemoryRouter, Outlet } from 'react-router-dom';

import { Folder } from '../../../../components/pages/Drive/Folder/Folder';
import { Subfolders } from '../../../../components/pages/Drive/Folder/Subfolder/Subfolders';
import { Files } from '../../../../components/pages/Drive/Folder/File/Files';

vi.mock('../../../../components/pages/Drive/Folder/Subfolder/Subfolders');
vi.mock('../../../../components/pages/Drive/Folder/File/Files');

describe('Folder component', () => {
	it(`should render a message if subfolders and files are not provided`, () => {
		const mockContext = {
			folder: {
				subfolders: [],
				files: [],
			},
		};

		const router = createMemoryRouter([
			{
				path: '/',
				element: <Outlet context={{ ...mockContext }} />,
				children: [
					{
						index: true,
						element: <Folder />,
					},
				],
			},
		]);

		render(<RouterProvider router={router} />);

		const message = screen.getByText('No files in the folder');

		expect(message).toBeInTheDocument();
	});
	it(`should render subfolders if folder's subfolders is provided`, () => {
		const mockContext = {
			folder: {
				subfolders: [
					{
						id: '1',
						name: 'folder',
					},
				],
				files: [],
			},
		};

		Subfolders.mockImplementationOnce(({ subfolders }) => (
			<ul>
				{subfolders.map(subfolder => (
					<div key={subfolder.id} data-testid="subfolder">
						{subfolder.name}
					</div>
				))}
			</ul>
		));

		const router = createMemoryRouter([
			{
				path: '/',
				element: <Outlet context={{ ...mockContext }} />,
				children: [
					{
						index: true,
						element: <Folder />,
					},
				],
			},
		]);

		render(<RouterProvider router={router} />);

		const subfolders = screen.getAllByTestId('subfolder');

		expect(subfolders).toHaveLength(mockContext.folder.subfolders.length);

		subfolders.forEach((subfolder, index) => {
			expect(mockContext.folder.subfolders[index].name).toBe(
				subfolder.textContent,
			);
		});
	});
	it(`should render files if folder's files is provided`, () => {
		const mockContext = {
			folder: {
				subfolders: [],
				files: [
					{
						id: '1',
						name: 'file',
					},
					{
						id: '2',
						name: 'second-file',
					},
				],
			},
		};

		Files.mockImplementationOnce(({ files }) => (
			<ul>
				{files.map(file => (
					<div key={file.id} data-testid="file">
						{file.name}
					</div>
				))}
			</ul>
		));

		const router = createMemoryRouter([
			{
				path: '/',
				element: <Outlet context={{ ...mockContext }} />,
				children: [
					{
						index: true,
						element: <Folder />,
					},
				],
			},
		]);

		render(<RouterProvider router={router} />);

		const files = screen.getAllByTestId('file');

		expect(files).toHaveLength(mockContext.folder.files.length);

		files.forEach((file, index) => {
			expect(mockContext.folder.files[index].name).toBe(file.textContent);
		});
	});
});
