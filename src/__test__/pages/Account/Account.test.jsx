import { expect, describe, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { RouterProvider, createMemoryRouter, Outlet } from 'react-router-dom';

import { Account } from '../../../components/pages/Account/Account';

describe('Account component', () => {
	it('should render title, loading component and children if props are provided', () => {
		const mockContext = {
			userId: null,
		};

		const mockProps = {
			title: 'title',
			loading: true,
		};

		const mockContent = 'Account content';
		const mockChildren = <p>{mockContent}</p>;

		const router = createMemoryRouter([
			{
				path: '/',
				element: <Outlet context={{ ...mockContext }} />,
				children: [
					{
						index: true,
						element: <Account {...mockProps}>{mockChildren}</Account>,
					},
				],
			},
		]);

		render(<RouterProvider router={router} />);

		const title = screen.getByRole('heading', {
			name: mockProps.title,
			level: 3,
		});
		const children = screen.getByText(mockContent);
		const loading = screen.getByText('Submitting...');

		expect(title).toBeInTheDocument();
		expect(children).toBeInTheDocument();
		expect(loading).toBeInTheDocument();
	});
	it('should navigate to "/drive" path if "userId" outlet context is provided', () => {
		const mockContext = {
			userId: '1',
		};

		const mockContent = 'Drive page';
		const mockComponent = <p>{mockContent}</p>;

		const router = createMemoryRouter([
			{
				path: '/',
				element: <Outlet context={{ ...mockContext }} />,
				children: [
					{
						index: true,
						element: <Account />,
					},
					{
						path: '/drive',
						element: mockComponent,
					},
				],
			},
		]);

		render(<RouterProvider router={router} />);

		const content = screen.getByText(mockContent);

		expect(content).toBeInTheDocument();
	});
});
