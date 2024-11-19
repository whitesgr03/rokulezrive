import { expect, describe, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { RouterProvider, createMemoryRouter, Outlet } from 'react-router-dom';
import { Context as ResponsiveContext } from 'react-responsive';

import { Home } from '../../../components/pages/Home/Home';

describe('Home component', () => {
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
						element: <Home />,
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
	it(`should render desktop content if the user's device screen is 1000 pixels wide or larger.`, () => {
		const mockContext = {
			userId: null,
		};

		const router = createMemoryRouter([
			{
				path: '/',
				element: (
					<ResponsiveContext.Provider value={{ width: 1000 }}>
						<Outlet context={{ ...mockContext }} />
					</ResponsiveContext.Provider>
				),
				children: [
					{
						index: true,
						element: <Home />,
					},
				],
			},
		]);

		render(<RouterProvider router={router} />);

		const img = screen.getByAltText('hero image');
		const element = screen.getByTestId('introduce');
		const text = screen.getByText('Sign up for a FREE account today!');
		const link = screen.getAllByRole('link', { name: 'freepik' });

		expect(img).toBeInTheDocument();
		expect(element).toHaveClass(/introduce-reverse/);
		expect(text).toBeInTheDocument();
		expect(link.length).toBe(3);
	});
});
