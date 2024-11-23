import { expect, describe, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Modal } from '../../../components/pages/App/Modal';

describe('Modal component', () => {
	it(`should render children prop if children prop is provided`, () => {
		const mockContent = 'children';

		const mockProps = {
			children: <p>{mockContent}</p>,
		};
		render(<Modal {...mockProps} />);

		const children = screen.getByText(mockContent);

		expect(children).toBeInTheDocument();
	});
	it(`should close modal if "clickToClose" prop is provided and close button is clicked`, async () => {
		const user = userEvent.setup();
		const mockProps = {
			clickToClose: true,
			onActiveModal: vi.fn(),
		};
		render(<Modal {...mockProps} />);

		const closeButton = screen.getByTitle('close-button');

		await user.click(closeButton);

		expect(mockProps.onActiveModal).toBeCalledTimes(1);
	});
	it(`should close modal if shadow background is clicked`, async () => {
		const user = userEvent.setup();
		const mockProps = {
			onActiveModal: vi.fn(),
		};
		render(<Modal {...mockProps} />);

		const shadowBackground = screen.getByTestId('modal');

		await user.click(shadowBackground);

		expect(mockProps.onActiveModal).toBeCalledTimes(1);
	});
});
