import { expect, describe, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { RouterProvider, createMemoryRouter, Navigate } from 'react-router-dom';
import { Error } from '../../../components/utils/Error/Error';

describe('Loading component', () => {
	it('should render default error message and default link if "customMessage" state is not provided', () => {
		const router = createMemoryRouter(
			[
				{
					path: '/',
					element: <Navigate to={'/error'} />,
				},
				{
					path: '/error',
					element: <Error />,
				},
			],
			{ initialEntries: ['/'] },
		);

		render(<RouterProvider router={router} />);

		const element = screen.getByText(
			'Please come back later, or if you have any questions, contact us.',
		);

		const link = screen.getByRole('link', { name: 'Back to Home Page' });

		expect(element).toBeInTheDocument();
		expect(link).toBeInTheDocument();
	});
	it('should render custom error message if "customMessage" state is provided', () => {
		const mockState = {
			error: 'custom message.',
			customMessage: true,
		};

		const router = createMemoryRouter(
			[
				{
					path: '/',
					element: <Navigate to={'/error'} state={{ ...mockState }} />,
				},
				{
					path: '/error',
					element: <Error />,
				},
			],
			{ initialEntries: ['/'] },
		);

		render(<RouterProvider router={router} />);

		const element = screen.getByText('custom message.');

		expect(element).toBeInTheDocument();
	});
	it('should render "Go Back" link if "previousPath" state is provided', () => {
		const mockState = {
			previousPath: '/',
		};

		const router = createMemoryRouter(
			[
				{
					path: '/',
					element: <Navigate to={'/error'} state={{ ...mockState }} />,
				},
				{
					path: '/error',
					element: <Error />,
				},
			],
			{ initialEntries: ['/'] },
		);

		render(<RouterProvider router={router} />);

		const element = screen.getByRole('link', { name: 'Go Back' });

		expect(element).toBeInTheDocument();
	});
});
