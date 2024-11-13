import { expect, describe, it } from 'vitest';
import { render, screen } from '@testing-library/react';

import { Loading } from '../../../components/utils/Loading/Loading';

describe('Loading component', () => {
	it('should render text if text prop is provided', () => {
		const mockProp = {
			text: 'loading',
		};

		render(<Loading {...mockProp} />);

		const element = screen.getByText(mockProp.text);

		expect(element).toBeInTheDocument();
	});
	it('should render dark class name if dark prop is provided', () => {
		const mockProp = {
			dark: true,
			text: 'loading',
		};

		render(<Loading {...mockProp} />);

		const element = screen.getByText(mockProp.text);

		expect(element).toHaveClass(/dark/);
  });
  it('should render light class name if light prop is provided', () => {
		const mockProp = {
			light: true,
			text: 'loading',
		};

		render(<Loading {...mockProp} />);

		const element = screen.getByText(mockProp.text);

		expect(element).toHaveClass(/light/);
  });
  it('should render shadow class name if shadow prop is provided', () => {
		const mockProp = {
			shadow: true,
			text: 'loading',
		};

		render(<Loading {...mockProp} />);

		const element = screen.getByText(mockProp.text);

		expect(element).toHaveClass(/shadow/);
	});
});
