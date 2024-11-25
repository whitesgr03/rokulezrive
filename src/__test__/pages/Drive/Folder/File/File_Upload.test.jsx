import { expect, describe, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { RouterProvider, createMemoryRouter } from 'react-router-dom';
import { supabase } from '../../../../../utils/supabase_client';
import { handleFetch } from '../../../../../utils/handle_fetch';

import { FileUpload } from '../../../../../components/pages/Drive/Folder/File/File_Upload';

vi.mock('../../../../../utils/supabase_client');
vi.mock('../../../../../utils/handle_fetch');

describe('FileUpload component', () => {
	it('should render error messages and file information if file preview but the size is larger than the limit', async () => {
		const user = userEvent.setup();

		const mockProps = {
			folderId: '1',
			onUpdateFolder: vi.fn(),
			onActiveModal: vi.fn(),
		};

		const router = createMemoryRouter([
			{
				path: '/',
				element: <FileUpload {...mockProps} />,
			},
		]);

		render(<RouterProvider router={router} />);

		const uploadField = screen.getByTitle('upload');

		const file = new File([''], 'test.png');
		Object.defineProperty(file, 'size', { value: 1024 * 1024 + 1 });

		await user.upload(uploadField, file);

		const uploadErrorMessageWrap = screen.getByTestId('upload-message');
		const uploadErrorMessage = screen.getByText('Size must be less than 1 MB.');

		expect(uploadField).toHaveClass(/form-input-error/);
		expect(uploadErrorMessageWrap).toHaveClass(/form-message-active/);
		expect(uploadErrorMessage).toBeInTheDocument();
	});
	it('should change the file field value and render file information if file preview is successful', async () => {
		const user = userEvent.setup();

		const mockProps = {
			folderId: '1',
			onUpdateFolder: vi.fn(),
			onActiveModal: vi.fn(),
		};

		const router = createMemoryRouter([
			{
				path: '/',
				element: <FileUpload {...mockProps} />,
			},
		]);

		render(<RouterProvider router={router} />);

		const uploadField = screen.getByTitle('upload');

		const file = new File([''], 'test.png');
		Object.defineProperty(file, 'size', { value: 1 });

		await user.upload(uploadField, file);

		const fileName = screen.getByText('test.png');
		const fileSize = screen.getByText('1 Bytes');
		const button = screen.getByRole('button', { name: 'Upload' });

		expect(fileName).toBeInTheDocument();
		expect(fileSize).toBeInTheDocument();
		expect(button).toBeInTheDocument();
	});
	it('should cancel file preview if reset button is clicked', async () => {
		const user = userEvent.setup();

		const mockProps = {
			folderId: '1',
			onUpdateFolder: vi.fn(),
			onActiveModal: vi.fn(),
		};

		const router = createMemoryRouter([
			{
				path: '/',
				element: <FileUpload {...mockProps} />,
			},
		]);

		render(<RouterProvider router={router} />);

		const uploadField = screen.getByTitle('upload');

		const file = new File([''], 'test.png');

		await user.upload(uploadField, file);

		const resetButton = screen.getByTitle('Reset button');

		await user.click(resetButton);

		expect(resetButton).not.toBeInTheDocument();
	});
	it('should navigate to "/drive/error" path if upload file fails', async () => {
		const user = userEvent.setup();

		const mockProps = {
			folderId: '1',
			onUpdateFolder: vi.fn(),
			onActiveModal: vi.fn(),
		};

		handleFetch.mockReturnValueOnce({ success: false });

		supabase.auth.getSession.mockReturnValueOnce({
			data: { session: { accessToken: '' } },
		});

		const router = createMemoryRouter([
			{
				path: '/',
				element: <FileUpload {...mockProps} />,
			},
			{
				path: '/drive/error',
				element: <p>Error Page</p>,
			},
		]);

		render(<RouterProvider router={router} />);

		const uploadField = screen.getByTitle('upload');

		const file = new File([''], 'test.png');

		await user.upload(uploadField, file);

		const uploadButton = screen.getByRole('button', { name: 'Upload' });

		await user.click(uploadButton);

		const errorMessage = screen.getByText('Error Page');

		expect(errorMessage).toBeInTheDocument();

		expect(mockProps.onActiveModal).toBeCalledTimes(1);
	});
	it('should navigate to homepage if the file under any sub-path on the homepage is successfully uploaded', async () => {
		const user = userEvent.setup();

		const mockProps = {
			folderId: '1',
			onUpdateFolder: vi.fn(),
			onActiveModal: vi.fn(),
		};

		handleFetch.mockReturnValueOnce({ success: true });

		supabase.auth.getSession.mockReturnValueOnce({
			data: { session: { accessToken: '' } },
		});

		const router = createMemoryRouter(
			[
				{
					path: '/drive',
					element: <p>Home Page</p>,
				},
				{
					path: '/drive/shared/:id',
					element: <FileUpload {...mockProps} />,
				},
			],
			{ initialEntries: ['/drive/shared/1'] },
		);

		render(<RouterProvider router={router} />);

		const uploadField = screen.getByTitle('upload');

		const file = new File([''], 'test.png');

		await user.upload(uploadField, file);

		const uploadButton = screen.getByRole('button', { name: 'Upload' });

		await user.click(uploadButton);

		const element = screen.getByText('Home Page');

		expect(element).toBeInTheDocument();
		expect(mockProps.onUpdateFolder).toBeCalledTimes(1);
		expect(mockProps.onActiveModal).toBeCalledTimes(1);
	});
	it('should navigate to the specified folder path if the file under any sub-path on the specified folder page is successfully uploaded', async () => {
		const user = userEvent.setup();

		const mockProps = {
			folderId: '1',
			onUpdateFolder: vi.fn(),
			onActiveModal: vi.fn(),
		};

		handleFetch.mockReturnValueOnce({ success: true });

		supabase.auth.getSession.mockReturnValueOnce({
			data: { session: { accessToken: '' } },
		});

		const router = createMemoryRouter(
			[
				{
					path: '/drive/folders/:id',
					element: <p>Home Page</p>,
				},
				{
					path: '/drive/folders/:id/shared/:id',
					element: <FileUpload {...mockProps} />,
				},
			],
			{ initialEntries: ['/drive/folders/1/shared/1'] },
		);

		render(<RouterProvider router={router} />);

		const uploadField = screen.getByTitle('upload');

		const file = new File([''], 'test.png');

		await user.upload(uploadField, file);

		const uploadButton = screen.getByRole('button', { name: 'Upload' });

		await user.click(uploadButton);

		const element = screen.getByText('Home Page');

		expect(element).toBeInTheDocument();
		expect(mockProps.onUpdateFolder).toBeCalledTimes(1);
		expect(mockProps.onActiveModal).toBeCalledTimes(1);
	});
});
