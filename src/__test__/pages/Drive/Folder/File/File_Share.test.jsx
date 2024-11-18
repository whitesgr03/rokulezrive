import { expect, describe, it, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { RouterProvider, createMemoryRouter } from 'react-router-dom';
import { supabase } from '../../../../../utils/supabase_client';
import { handleFetch } from '../../../../../utils/handle_fetch';

import { FileShare } from '../../../../../components/pages/Drive/Folder/File/File_Share';

vi.mock('../../../../../utils/supabase_client');
vi.mock('../../../../../utils/handle_fetch');

describe('FileShare component', () => {
	it('should change the field values if any input field is typed', async () => {
		const user = userEvent.setup();

		const mockProps = {
			name: 'file',
			sharers: [],
			publicId: '1',
			fileId: '1',
			onUpdateFolder: vi.fn(),
			onActiveModal: vi.fn(),
		};

		const router = createMemoryRouter([
			{
				path: '/',
				element: <FileShare {...mockProps} />,
			},
		]);

		render(<RouterProvider router={router} />);

		const emailField = screen.getByLabelText('Share people with email');

		await user.type(emailField, 'email');

		expect(emailField).toHaveValue('email');
	});
	it('should render the error field messages if any field fails validation after submission', async () => {
		const user = userEvent.setup();

		const mockProps = {
			name: 'file',
			sharers: [],
			publicId: '1',
			fileId: '1',
			onUpdateFolder: vi.fn(),
			onActiveModal: vi.fn(),
		};

		const router = createMemoryRouter([
			{
				path: '/',
				element: <FileShare {...mockProps} />,
			},
		]);

		render(<RouterProvider router={router} />);

		const submitBtn = screen.getByTitle('submit');

		await user.click(submitBtn);

		const emailField = screen.getByLabelText('Share people with email');
		const emailErrorMessageWrap = screen.getByTestId('email-message');
		const emailErrorMessage = screen.getByText('Email is required.');

		expect(emailField).toHaveClass(/form-input-error/);
		expect(emailErrorMessageWrap).toHaveClass(/form-message-active/);
		expect(emailErrorMessage).toBeInTheDocument();
	});
	it('should render an error field message if creating file sharer error occurs after submission', async () => {
		const user = userEvent.setup();

		const mockProps = {
			name: 'file',
			sharers: [],
			publicId: '1',
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
			fields: {
				email: 'error',
			},
		});

		const router = createMemoryRouter([
			{
				path: '/',
				element: <FileShare {...mockProps} />,
			},
		]);

		render(<RouterProvider router={router} />);

		const submitBtn = screen.getByTitle('submit');
		const emailField = screen.getByLabelText('Share people with email');

		await user.type(emailField, 'email@email.com');
		await user.click(submitBtn);

		const emailErrorMessageWrap = screen.getByTestId('email-message');
		const emailErrorMessage = screen.getByText('error');

		expect(emailField).toHaveClass(/form-input-error/);
		expect(emailErrorMessageWrap).toHaveClass(/form-message-active/);
		expect(emailErrorMessage).toBeInTheDocument();
	});
	it('should navigate to "/drive/error" path if creating file sharer error occurs after submission', async () => {
		const user = userEvent.setup();

		const mockProps = {
			name: 'file',
			sharers: [],
			publicId: '1',
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
				element: <FileShare {...mockProps} />,
			},
			{
				path: '/drive/error',
				element: <p>Error Page</p>,
			},
		]);

		render(<RouterProvider router={router} />);

		const submitBtn = screen.getByTitle('submit');
		const emailField = screen.getByLabelText('Share people with email');

		await user.type(emailField, 'email@email.com');
		await user.click(submitBtn);

		const errorMessage = screen.getByText('Error Page');

		expect(errorMessage).toBeInTheDocument();
		expect(mockProps.onActiveModal).toBeCalledTimes(1);
	});
	it('should render the file sharers if creating file sharer is successful', async () => {
		const user = userEvent.setup();

		const mockProps = {
			name: 'file',
			sharers: [],
			publicId: '1',
			fileId: '1',
			onUpdateFolder: vi.fn(),
			onActiveModal: vi.fn(),
		};

		const mockEmail = ['email@email.com', 'test@email.com'];

		supabase.auth.getSession.mockResolvedValue({
			data: {
				session: { access_token: '' },
			},
		});

		handleFetch
			.mockResolvedValueOnce({
				success: true,
				data: {
					newShare: {
						sharer: {
							id: '1',
							email: mockEmail[0],
						},
					},

					currentFolder: '',
				},
			})
			.mockResolvedValueOnce({
				success: true,
				data: {
					newShare: {
						sharer: {
							id: '2',
							email: mockEmail[1],
						},
					},

					currentFolder: '',
				},
			});

		const router = createMemoryRouter([
			{
				path: '/',
				element: <FileShare {...mockProps} />,
			},
		]);

		render(<RouterProvider router={router} />);

		const submitBtn = screen.getByTitle('submit');
		const emailField = screen.getByLabelText('Share people with email');

		await user.type(emailField, mockEmail[0]);
		await user.click(submitBtn);

		await user.type(emailField, mockEmail[1]);
		await user.click(submitBtn);

		const sharers = screen.getAllByRole('listitem');

		expect(sharers).toHaveLength(mockEmail.length);
		expect(emailField).toHaveValue('');
		expect(mockProps.onUpdateFolder).toBeCalledTimes(2);
	});
	it('should navigate to "/drive/error" path if deleting file sharer error occurs after clicking button', async () => {
		const user = userEvent.setup();

		const mockProps = {
			name: 'file',
			sharers: [],
			publicId: '1',
			fileId: '1',
			onUpdateFolder: vi.fn(),
			onActiveModal: vi.fn(),
		};

		const mockEmail = ['email@email.com', 'test@email.com'];

		supabase.auth.getSession.mockResolvedValue({
			data: {
				session: { access_token: '' },
			},
		});

		handleFetch
			.mockResolvedValueOnce({
				success: true,
				data: {
					newShare: {
						sharer: {
							id: '1',
							email: mockEmail[0],
						},
					},

					currentFolder: '',
				},
			})
			.mockResolvedValueOnce({
				success: false,
			});

		const router = createMemoryRouter([
			{
				path: '/',
				element: <FileShare {...mockProps} />,
			},
			{
				path: '/drive/error',
				element: <p>Error Page</p>,
			},
		]);

		render(<RouterProvider router={router} />);

		const submitBtn = screen.getByTitle('submit');
		const emailField = screen.getByLabelText('Share people with email');

		await user.type(emailField, 'email@email.com');
		await user.click(submitBtn);

		const deleteSharerButton = screen.getByTitle('delete-sharer-button');
		await user.click(deleteSharerButton);

		const errorMessage = screen.getByText('Error Page');

		expect(errorMessage).toBeInTheDocument();
		expect(mockProps.onActiveModal).toBeCalledTimes(1);
	});
	it('should delete the specified file sharer if deleting file sharer is successful', async () => {
		const user = userEvent.setup();

		const mockProps = {
			name: 'file',
			sharers: [],
			publicId: '1',
			fileId: '1',
			onUpdateFolder: vi.fn(),
			onActiveModal: vi.fn(),
		};

		const mockEmail = ['email@email.com'];

		supabase.auth.getSession.mockResolvedValue({
			data: {
				session: { access_token: '' },
			},
		});

		handleFetch
			.mockResolvedValueOnce({
				success: true,
				data: {
					newShare: {
						sharer: {
							id: '1',
							email: mockEmail[0],
						},
					},

					currentFolder: '',
				},
			})
			.mockResolvedValueOnce({
				success: true,
			});

		const router = createMemoryRouter([
			{
				path: '/',
				element: <FileShare {...mockProps} />,
			},
		]);

		render(<RouterProvider router={router} />);

		const submitBtn = screen.getByTitle('submit');
		const emailField = screen.getByLabelText('Share people with email');

		await user.type(emailField, 'email@email.com');
		await user.click(submitBtn);

		const sharers = screen.getAllByRole('listitem');
		expect(sharers).toHaveLength(1);

		const deleteSharerButton = screen.getByTitle('delete-sharer-button');
		await user.click(deleteSharerButton);

		const afterDeleteSharers = screen.queryAllByRole('listitem');

		expect(afterDeleteSharers).toHaveLength(0);
		expect(mockProps.onUpdateFolder).toBeCalledTimes(2);
	});
	it('should navigate to "/drive/error" path if public file error occurs after public file checkbox is selected', async () => {
		const user = userEvent.setup();

		const mockProps = {
			name: 'file',
			sharers: [],
			publicId: '',
			fileId: '1',
			onUpdateFolder: vi.fn(),
			onActiveModal: vi.fn(),
		};

		supabase.auth.getSession.mockResolvedValue({
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
				element: <FileShare {...mockProps} />,
			},
			{
				path: '/drive/error',
				element: <p>Error Page</p>,
			},
		]);

		render(<RouterProvider router={router} />);

		const checkbox = screen.getByLabelText('Anyone with the link');

		await user.click(checkbox);

		const errorMessage = screen.getByText('Error Page');

		expect(errorMessage).toBeInTheDocument();
		expect(mockProps.onActiveModal).toBeCalledTimes(1);
	});
	it('should render copy button if public file is successful', async () => {
		const user = userEvent.setup();

		const mockProps = {
			name: 'file',
			sharers: [],
			publicId: '',
			fileId: '1',
			onUpdateFolder: vi.fn(),
			onActiveModal: vi.fn(),
		};

		supabase.auth.getSession.mockResolvedValue({
			data: {
				session: { access_token: '' },
			},
		});

		handleFetch.mockResolvedValueOnce({
			success: true,
			data: { publicFileId: '1', currentFolder: {} },
		});

		const router = createMemoryRouter([
			{
				path: '/',
				element: <FileShare {...mockProps} />,
			},
		]);

		render(<RouterProvider router={router} />);

		const checkbox = screen.getByLabelText('Anyone with the link');

		await user.click(checkbox);

		const checkBoxBorderElement = screen.getByTestId('checkbox-border');
		const checkBoxIcon = screen.getByTestId('is-check');
		const copyButton = screen.getByTitle('copy-button');

		expect(checkbox.checked).toBeTruthy();
		expect(checkBoxBorderElement).toHaveClass(/is-check-border/);
		expect(checkBoxIcon).toHaveClass(/is-check/);
		expect(copyButton).not.toHaveClass(/hide-btn/);
		expect(mockProps.onUpdateFolder).toBeCalledTimes(1);
	});
	it('should delete copy button if public file checkbox is deselected', async () => {
		const user = userEvent.setup();

		const mockProps = {
			name: 'file',
			sharers: [],
			publicId: '1',
			fileId: '1',
			onUpdateFolder: vi.fn(),
			onActiveModal: vi.fn(),
		};

		supabase.auth.getSession.mockResolvedValue({
			data: {
				session: { access_token: '' },
			},
		});

		handleFetch.mockResolvedValueOnce({
			success: true,
			data: { publicFileId: '1', currentFolder: {} },
		});

		const router = createMemoryRouter([
			{
				path: '/',
				element: <FileShare {...mockProps} />,
			},
		]);

		render(<RouterProvider router={router} />);

		const checkbox = screen.getByLabelText('Anyone with the link');
		const checkBoxBorderElement = screen.getByTestId('checkbox-border');
		const checkBoxIcon = screen.getByTestId('is-check');
		const copyButton = screen.getByTitle('copy-button');

		await user.click(checkbox);

		expect(checkbox.checked).toBeFalsy();
		expect(checkBoxBorderElement).not.toHaveClass(/is-check-border/);
		expect(checkBoxIcon).not.toHaveClass(/is-check/);
		expect(copyButton).toHaveClass(/hide-btn/);
		expect(mockProps.onUpdateFolder).toBeCalledTimes(1);
	});
	it('should copy public file url if copy button is clicked', async () => {
		const user = userEvent.setup();

		const mockProps = {
			name: 'file',
			sharers: [],
			publicId: '1',
			fileId: '1',
			onUpdateFolder: vi.fn(),
			onActiveModal: vi.fn(),
		};

		supabase.auth.getSession.mockResolvedValue({
			data: {
				session: { access_token: '' },
			},
		});

		handleFetch.mockResolvedValueOnce({
			success: true,
			data: { publicFileId: '1', currentFolder: {} },
		});

		const router = createMemoryRouter([
			{
				path: '/',
				element: <FileShare {...mockProps} />,
			},
		]);

		render(<RouterProvider router={router} />);

		const copyButton = screen.getByTitle('copy-button');

		const copyLinkWrap = screen.getByTestId('copy-link-wrap');

		await user.click(copyButton);

		expect(copyLinkWrap).toHaveClass(/copied/);

		fireEvent.animationEnd(copyLinkWrap);

		expect(copyLinkWrap).not.toHaveClass(/copied/);
	});
});
