import { expect, describe, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { RouterProvider, createMemoryRouter } from 'react-router-dom';

import { Navbar } from '../../../components/layout/Navbar/Navbar';

describe('Navbar component', () => {
	it('should render the active class name for the clicked link.', async () => {
		const user = userEvent.setup();
		const router = createMemoryRouter(
			[
				{
					path: '/drive',
					element: <Navbar />,
					children: [
						{
							path: 'shared',
							element: <p>shared page</p>,
						},
						{
							path: 'folders/my-drive',
							element: <p>my-drive page</p>,
						},
					],
				},
			],
			{ initialEntries: ['/drive/shared'] },
		);

		render(<RouterProvider router={router} />);

		const homeBtn = screen.getByRole('link', { name: 'Home' });
		const sharedBtn = screen.getByRole('link', { name: 'Shared' });
		const filesBtn = screen.getByRole('link', { name: 'Files' });

		await user.click(homeBtn);

		expect(homeBtn).toHaveClass(/active/);
		expect(sharedBtn).not.toHaveClass(/active/);
		expect(filesBtn).not.toHaveClass(/active/);

		await user.click(sharedBtn);

		expect(sharedBtn).toHaveClass(/active/);
		expect(homeBtn).not.toHaveClass(/active/);
		expect(filesBtn).not.toHaveClass(/active/);

		await user.click(filesBtn);

		expect(filesBtn).toHaveClass(/active/);
		expect(homeBtn).not.toHaveClass(/active/);
		expect(sharedBtn).not.toHaveClass(/active/);
	});
});
