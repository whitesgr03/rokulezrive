import { expect, describe, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { RouterProvider, createMemoryRouter, Outlet } from 'react-router-dom';

import { Authentication } from '../../../components/utils/Authentication/Authentication';

describe('Authentication component', () => {
	it('should render children prop if outlet context "userId" is provided', () => {
		const mockProps = {
			userId: true,
		};

		const mockChildren = <p>Authentication Children</p>;

		const router = createMemoryRouter([
			{
				path: '/',
				element: <Outlet context={{ ...mockProps }} />,
				children: [
					{
						index: true,
						element: <Authentication>{mockChildren}</Authentication>,
					},
				],
			},
		]);

		render(<RouterProvider router={router} />);

		const element = screen.getByText('Authentication Children');

		expect(element).toBeInTheDocument();
	});
	it('should navigate to "/" path if outlet context "userId" is not provided', () => {
		const mockProps = {
			userId: false,
		};

		const router = createMemoryRouter(
			[
				{
					path: '/',
					element: (
						<>
							<p>component</p>
							<Outlet context={{ ...mockProps }} />
						</>
					),
					children: [
						{
							path: '/error',
							element: (
								<Authentication>
									<p>Authentication Children</p>
								</Authentication>
							),
						},
					],
				},
			],
			{ initialEntries: ['/error'] },
		);

		render(<RouterProvider router={router} />);

		const element = screen.getByText('component');

		expect(element).toBeInTheDocument();
	});
});
