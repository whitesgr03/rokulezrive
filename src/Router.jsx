import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import './styles/index.css';

import { App } from './components/pages/App/App';
import { Home } from './components/pages/Home/Home';
import { Drive } from './components/pages/Drive/Drive';
import { Login } from './components/pages/Account/Login';
import { Register } from './components/pages/Account/Register';
import { NotFound } from './components/utils/Error/NotFound';
import { Error } from './components/utils/Error/Error';

import { Folder } from './components/pages/Drive/Folder/Folder';
import { Shared } from './components/pages/Drive/Shared';
import { Upload } from './components/pages/Drive/upload';
import { File_Into } from './components/pages/Drive/File_Info';

import { Authentication } from './components/utils/Authentication/Authentication';

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
										<Folder />
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
