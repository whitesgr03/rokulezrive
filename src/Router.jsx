import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import './styles/index.css';

import { App } from './components/pages/App';
import { Home } from './components/pages/Home';
import { Drive } from './components/pages/Drive';
import { Login } from './components/pages/Account/Login';
import { Register } from './components/pages/Account/Register';
import { NotFound } from './components/utils/Error/NotFound';

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
						path: '/drive/:type?',
						element: (
							<Authentication>
								<Drive />
							</Authentication>
						),
					},
					{
						path: 'account',
						children: [
							{
								path: 'login',
								element: <Login />,
							},
							{
								path: 'register',
								element: <Register />,
							},
						],
					},
					{
						path: '*',
						element: <NotFound />,
					},
				],
			},
		])}
	/>
);
