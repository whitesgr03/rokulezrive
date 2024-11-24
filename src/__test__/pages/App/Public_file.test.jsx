import { expect, describe, it, vi } from 'vitest';
import {
	render,
	screen,
	waitForElementToBeRemoved,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { RouterProvider, createMemoryRouter, Outlet } from 'react-router-dom';
import { Context as ResponsiveContext } from 'react-responsive';
import { handleFetch, handleFetchBlob } from '../../../utils/handle_fetch';
import { createDownloadElement } from '../../../utils/create_download_element';
import { formatBytes } from '../../../utils/format_bytes';
import { format } from 'date-fns';

import { PublicFile } from '../../../components/pages/App/Public_File';
import { Footer } from '../../../components/layout/Footer/Footer';

vi.mock('../../../utils/supabase_client');
vi.mock('../../../utils/handle_fetch');
vi.mock('../../../utils/create_download_element');
vi.mock('../../../utils/format_bytes');
vi.mock('../../../utils/create_download_element');
vi.mock('date-fns');
vi.mock('../../../components/layout/Footer/Footer');

describe('PublicFile component', () => {
	it(`should navigate to '/error' path if fetch the public file is fails`, async () => {
		handleFetch.mockResolvedValue({
			success: false,
			message: 'error',
		});

		const router = createMemoryRouter([
			{
				path: '/',
				element: <Outlet />,
				children: [
					{
						index: true,
						element: <PublicFile />,
					},
					{ path: 'error', element: <p>Error page</p> },
				],
			},
		]);

		render(<RouterProvider router={router} />);

		const errorMessage = await screen.findByText('Error page');

		expect(errorMessage).toBeInTheDocument();
	});
	it(`should render the public file data if fetch the public file is successful`, async () => {
		const mockData = {
			name: 'public file',
			type: 'image',
			size: 1,
			owner: { email: 'email@email.com' },
			sharedAt: new Date(),
		};
		handleFetch.mockResolvedValue({
			success: true,
			data: mockData,
		});

		const router = createMemoryRouter([
			{
				path: '/',
				element: <Outlet />,
				children: [
					{
						index: true,
						element: <PublicFile />,
					},
				],
			},
		]);

		render(<RouterProvider router={router} />);

		await waitForElementToBeRemoved(() => screen.getByText(/loading/i));

		const name = screen.getByText(mockData.name);
		const email = screen.getByText(`Shared by: ${mockData.owner.email}`);
		const type = screen.getByTestId('file-type');

		expect(name).toBeInTheDocument();
		expect(email).toBeInTheDocument();
		expect(type).toHaveClass(RegExp(`${mockData.type}`));
		expect(formatBytes).toBeCalledWith(mockData.size);
		expect(format.mock.calls[0][0]).toBe(mockData.sharedAt);
	});
	it(`should render footer component if the user's device screen is wider than 700 pixels`, async () => {
		const mockData = {
			name: 'public file',
			type: 'image',
			size: 1,
			owner: { email: 'email@email.com' },
			sharedAt: new Date(),
		};
		handleFetch.mockResolvedValue({
			success: true,
			data: mockData,
		});

		Footer.mockImplementationOnce(() => <p>Footer component</p>);

		const router = createMemoryRouter([
			{
				path: '/',
				element: <Outlet />,
				children: [
					{
						index: true,
						element: (
							<ResponsiveContext.Provider value={{ width: 710 }}>
								<PublicFile />
							</ResponsiveContext.Provider>
						),
					},
				],
			},
		]);

		render(<RouterProvider router={router} />);

		const footerComponent = screen.getByText('Footer component');

		expect(footerComponent).toBeInTheDocument();

		await waitForElementToBeRemoved(() => screen.getByText(/loading/i));
	});
	it('should navigate to "/error" path if get resource url is fails', async () => {
		const user = userEvent.setup();
		const mockData = {
			name: 'public file',
			type: 'image',
			size: 1,
			owner: { email: 'email@email.com' },
			sharedAt: new Date(),
		};
		handleFetch
			.mockResolvedValueOnce({
				success: true,
				data: mockData,
			})
			.mockResolvedValueOnce({ success: false, message: 'error' });

		const router = createMemoryRouter([
			{
				path: '/',
				element: <Outlet />,
				children: [
					{
						index: true,
						element: <PublicFile />,
					},
					{
						path: 'error',
						element: <p>Error page</p>,
					},
				],
			},
		]);

		render(<RouterProvider router={router} />);

		const downloadBtn = await screen.findByRole('button', { name: 'Download' });

		await user.click(downloadBtn);

		const errorMessage = screen.getByText('Error page');

		expect(errorMessage).toBeInTheDocument();
	});
	it('should navigate to "/error" path if get resource blob is fails', async () => {
		const user = userEvent.setup();
		const mockData = {
			name: 'public file',
			type: 'image',
			size: 1,
			owner: { email: 'email@email.com' },
			sharedAt: new Date(),
		};
		handleFetch
			.mockResolvedValueOnce({
				success: true,
				data: mockData,
			})
			.mockResolvedValueOnce({ success: true, data: { url: '' } });

		handleFetchBlob.mockResolvedValueOnce({ success: false });

		const router = createMemoryRouter([
			{
				path: '/',
				element: <Outlet />,
				children: [
					{
						index: true,
						element: <PublicFile />,
					},
					{
						path: 'error',
						element: <p>Error page</p>,
					},
				],
			},
		]);

		render(<RouterProvider router={router} />);

		const downloadBtn = await screen.findByRole('button', { name: 'Download' });

		await user.click(downloadBtn);
		const errorMessage = screen.getByText('Error page');

		expect(errorMessage).toBeInTheDocument();
	});
	it('should download public file if download button is clicked', async () => {
		const user = userEvent.setup();
		const mockData = {
			name: 'public file',
			type: 'image',
			size: 1,
			owner: { email: 'email@email.com' },
			sharedAt: new Date(),
		};
		handleFetch
			.mockResolvedValueOnce({
				success: true,
				data: mockData,
			})
			.mockResolvedValueOnce({ success: true, data: { url: '' } });

		handleFetchBlob.mockResolvedValueOnce({ success: true, blob: 'url' });

		const mockElement = {
			click: vi.fn(),
		};

		createDownloadElement.mockReturnValueOnce(mockElement);

		const router = createMemoryRouter([
			{
				path: '/',
				element: <Outlet />,
				children: [
					{
						index: true,
						element: <PublicFile />,
					},
				],
			},
		]);

		render(<RouterProvider router={router} />);

		const downloadBtn = await screen.findByRole('button', {
			name: 'Download',
		});

		await user.click(downloadBtn);

		expect(mockElement.click).toBeCalledTimes(1);
	});
});
