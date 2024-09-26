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

	const folder = folderId
		? folders.find(folder => folder.id === folderId)
		: folders[0];

	const handleGetFolder = async (signal = null) => {
		setLoading(true);
		let url = `${import.meta.env.VITE_RESOURCE_URL}/api/folders`;

		const options = {
			method: 'GET',
			signal,
			credentials: 'include',
		};

		const result = await handleFetch(url, options);

		const handleResult = () => {
			result.success ? setFolders(result.data) : setError(result.message);
			setLoading(false);
		};

		result && handleResult();
	};

	useEffect(() => {
		const controller = new AbortController();
		const { signal } = controller;

		handleGetFolder(signal);
		return () => controller.abort();
	}, []);

	return (
		<>
			{error ? (
				<Navigate to="/error" state={{ error }} />
			) : (
				<div className={styles.drive}>
					{loading ? (
						<Loading text="Loading..." />
					) : (
						<>
							{<h2>{folder.name}</h2>}
							<Outlet
								context={{
									folder,
									shared,
									onActiveMenu,
									onActiveModal,
									onGetFolder: handleGetFolder,
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
