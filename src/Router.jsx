import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import './styles/index.css';

import { App } from './components/pages/App';
import { Home } from './components/pages/Home';
import { Drive } from './components/pages/Drive';

import { Authentication } from './components/utils/Authentication';

export const Router = () => (
	<RouterProvider
		router={createBrowserRouter([
			{
				path: '/',
				element: <App />,
				children: [
					{
						index: true,
						element: <Home />,
					},
					{
						path: '/drive',
						element: (
							<Authentication>
								<Drive />
							</Authentication>
						),
					},
				],
			},
		])}
	/>
);
