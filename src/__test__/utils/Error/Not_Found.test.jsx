import { expect, describe, it } from 'vitest';
import { render } from '@testing-library/react';

import { RouterProvider, createMemoryRouter } from 'react-router-dom';

import { Not_Found } from '../../../components/utils/Error/Not_Found';

describe('Not_Found component', () => {
	it('should match snapshot', () => {
		const router = createMemoryRouter([
			{
				path: '/',
				element: <Not_Found />,
			},
		]);

		const { asFragment } = render(<RouterProvider router={router} />);

		const actual = asFragment();

		expect(actual).toMatchSnapshot();
	});
});
