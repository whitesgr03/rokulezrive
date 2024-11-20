import { expect, describe, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { UploadList } from '../../../components/pages/Drive/Upload_List';

describe('UploadList component', () => {
	it('should show file upload modal if upload file button is clicked', async () => {
		const user = userEvent.setup();
		const mockProp = {
			folderId: '1',
			onActiveModal: vi.fn(),
			onUpdateFolder: vi.fn(),
		};

		render(<UploadList {...mockProp} />);

		const button = screen.getByRole('button', { name: 'Upload File' });

		await user.click(button);

		expect(mockProp.onActiveModal).toBeCalledTimes(1);
	});
	it('should show folder create modal if create folder button is clicked', async () => {
		const user = userEvent.setup();
		const mockProp = {
			folderId: '1',
			onActiveModal: vi.fn(),
			onUpdateFolder: vi.fn(),
		};

		render(<UploadList {...mockProp} />);

		const button = screen.getByRole('button', { name: 'Create Folder' });

		await user.click(button);

		expect(mockProp.onActiveModal).toBeCalledTimes(1);
	});
});
