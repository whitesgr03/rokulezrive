import { expect, describe, it } from 'vitest';
import { render, screen } from '@testing-library/react';

import { ValidationEmail } from '../../../components/pages/Account/Validation_Email';

describe('ValidationEmail component', () => {
	it('should render children prop if children is provided', () => {
		const mockChildren = 'test';

		render(<ValidationEmail>{mockChildren}</ValidationEmail>);

		const element = screen.getByText(mockChildren);

		expect(element).toBeInTheDocument();
	});
});
