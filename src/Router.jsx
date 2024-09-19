import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import './styles/index.css';

import { App } from './components/pages/App';
import { Home } from './components/pages/Home';
import { Drive } from './components/pages/Drive';
import { Login } from './components/pages/Account/Login';
import { Register } from './components/pages/Account/Register';
import { NotFound } from './components/utils/Error/NotFound';
import { Error } from './components/utils/Error';

import { Files } from './components/pages/Drive/Files';
import { Shared } from './components/pages/Drive/Shared';
import { Upload } from './components/pages/Drive/upload';
import { File_Into } from './components/pages/Drive/File_Info';

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
						path: 'drive',
						element: (
							<Authentication>
								<Drive />
							</Authentication>
						),
						children: [
							{
								index: true,
								element: (
									<>
										<Shared />
										<Files />
									</>
								),
							},
							{
								path: 'shared',
								element: <Shared />,
							},
							{
								path: 'shared/:fileId',
								element: <File_Into />,
							},
							{
								path: 'files',
								element: <Files />,
							},
							{
								path: 'files/upload',
								element: <Upload />,
							},

							{
								path: 'files/:fileId',
								element: <File_Into />,
							},
							{
								path: 'files/d/:folderId',
								element: <Files />,
							},
						],
					},
					{
						path: 'account/login',
						element: <Login />,
					},
					{
						path: 'account/register',
						element: <Register />,
					},
					{
						path: '*',
						element: <NotFound />,
					},
				],
			},
			{ path: '/error', element: <Error /> },
		])}
	/>
);
