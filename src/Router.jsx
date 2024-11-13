import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import './styles/index.css';

import { App } from './components/pages/App/App';
import { Home } from './components/pages/Home/Home';
import { Drive } from './components/pages/Drive/Drive';
import { Login } from './components/pages/Account/Login';
import { Register } from './components/pages/Account/Register';
import { PasswordForm } from './components/pages/Account/Password_Form';
import { NotFound } from './components/utils/Error/Not_Found';
import { Error } from './components/utils/Error/Error';

import { Folder } from './components/pages/Drive/Folder/Folder';
import { Shared } from './components/pages/Drive/Shared';
import { FileInfo } from './components/pages/Drive/Folder/File/File_Info';
import { SharedFile } from './components/pages/Drive/Shared_File';
import { PublicFile } from './components/pages/App/Public_File';

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
								element: <FileInfo />,
							},
							{
								path: 'shared',
								element: <Shared />,
							},
							{
								path: 'shared/:fileId',
								element: <SharedFile />,
							},
							{
								path: 'folders/my-drive',
								element: <Folder />,
							},
							{
								path: 'folders/my-drive/files/:fileId',
								element: <FileInfo />,
							},
							{
								path: 'folders/:folderId',
								element: <Folder />,
							},
							{
								path: 'folders/:folderId/files/:fileId',
								element: <FileInfo />,
							},
							{ path: 'error', element: <Error /> },
						],
					},
					{
						path: 'shared/:publicFileId',
						element: <PublicFile />,
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
						path: 'account/resetting-password',
						element: <PasswordForm />,
					},
					{
						path: '*',
						element: <NotFound />,
					},
					{ path: 'error', element: <Error /> },
				],
			},
		])}
	/>
);
