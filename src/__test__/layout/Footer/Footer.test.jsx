import { expect, describe, it } from 'vitest';
import { render } from '@testing-library/react';

import { Footer } from '../../../components/layout/Footer/Footer';

describe('Footer component', () => {
	it('should match snapshot', () => {
		const { asFragment } = render(<Footer />);

		const actual = asFragment();

		expect(actual).toMatchSnapshot();
	});
});
