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
import { File_Info } from './components/pages/Drive/Folder/File/File_Info';
import { Shared_File } from './components/pages/Drive/Shared_file';
import { Public_File } from './components/pages/App/Public_FIle';

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
								path: 'files/:fileId',
								element: <File_Info />,
							},
							{
								path: 'shared',
								element: <Shared />,
							},
							{
								path: 'shared/:fileId',
								element: <Shared_File />,
							},
							{
								path: 'folders/my-drive',
								element: <Folder />,
							},
							{
								path: 'folders/my-drive/files/:fileId',
								element: <File_Info />,
							},
							{
								path: 'folders/:folderId?',
								element: <Folder />,
							},
							{
								path: 'folders/:folderId?/files/:fileId',
								element: <File_Info />,
							},
						],
					},
					{
						path: 'shared/:shareId',
						element: <Public_File />,
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
