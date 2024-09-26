// Packages
import {
	Outlet,
	useOutletContext,
	Navigate,
	useParams,
} from 'react-router-dom';
import { useEffect, useState } from 'react';

// Styles
import styles from './Drive.module.css';

// Components
import { Loading } from '../../utils/Loading/Loading';

// Utils
import { handleFetch } from '../../../utils/handleFetch';

const sharedDefault = [
	{
		id: '3',
		name: 'first shared file',
		owner: 'facebook@gmail.com',
		type: 'pdf',
		createdAt: new Date(),
	},
	{
		id: '4',
		name: 'second shared file',
		owner: 'google@gmail.com',
		type: 'image',
		createdAt: new Date(),
	},
	{
		id: '8',
		name: 'second shared file',
		owner: 'google@gmail.com',
		type: 'image',
		createdAt: new Date(),
	},
	{
		id: '10',
		name: 'second shared file',
		owner: 'google@gmail.com',
		type: 'image',
		createdAt: new Date(),
	},
];

export const Drive = () => {
	const { onActiveMenu, onActiveModal, menu } = useOutletContext();

	const { folderId } = useParams();

	const [folders, setFolders] = useState([]);

	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	const shared = sharedDefault;

	const subfolder = folders.find(folder => folder.id === folderId);

	const data = folderId ? (subfolder ?? false) : (folders[0] ?? false);

	useEffect(() => {
		const controller = new AbortController();
		const { signal } = controller;

		const handleGetFolder = async () => {
			let url = `${import.meta.env.VITE_RESOURCE_URL}/api/folders`;

			folderId && (url += `/${folderId}`);

			const options = {
				method: 'GET',
				signal,
				credentials: 'include',
			};

			const result = await handleFetch(url, options);

			const handleResult = () => {
				const handleSuccess = () => {
					const { name, id, children: subfolders, files } = result.data;
					setFolders([
						...folders,
						{
							name,
							id,
							subfolders,
							files,
						},
					]);
				};
				result.success ? handleSuccess() : setError(result.message);
				setLoading(false);
			};

			result && handleResult();
		};
		!data && handleGetFolder();
		return () => controller.abort();
	}, [data, folderId, folders]);

	return (
		<>
			{error ? (
				<Navigate to="/error" state={{ error }} />
			) : (
				<div className={styles.drive}>
					{loading || !data ? (
						<Loading text="Loading..." />
					) : (
						<>
							{data && <h2>{data.name}</h2>}
							<Outlet
								context={{
									data,
									shared,
									onActiveMenu,
									onActiveModal,
									menu,
								}}
							/>
						</>
					)}
				</div>
			)}
		</>
	);
};
