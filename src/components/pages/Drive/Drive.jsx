// Packages
import {
	Outlet,
	useOutletContext,
	Navigate,
	useParams,
	Link,
} from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useMediaQuery } from 'react-responsive';

// Styles
import styles from './Drive.module.css';

// Components
import { Loading } from '../../utils/Loading/Loading';

// Utils
import { handleFetch } from '../../../utils/handle_fetch';

export const Drive = () => {
	const { onActiveMenu, onActiveModal, menu } = useOutletContext();

	const { folderId, fileId } = useParams();
	const isSmallMobile = useMediaQuery({ maxWidth: 450 });

	const [paths, setPaths] = useState([]);
	const [folders, setFolders] = useState([]);

	const [shared, setShared] = useState([]);

	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	const folder = folderId
		? folders.find(folder => folder.id === folderId)
		: folders[0];

	const handleGetFolder = async folderId => {
		setLoading(true);
		let url = `${import.meta.env.VITE_RESOURCE_URL}/api/folders/${folderId}`;

		const options = {
			method: 'GET',
			credentials: 'include',
		};

		const result = await handleFetch(url, options);

		const handleResult = () => {
			const newFolders = folders.map(folder =>
				folder.id === result.data.id ? result.data : folder,
			);
			setFolders(newFolders);
		};

		result.success ? handleResult() : setError(result.message);
		setLoading(false);
	};

	const handleAddFolder = (parentFolder, newFolder) => {
		const newFolders = folders.map(folder =>
			folder.id === parentFolder.id ? parentFolder : folder,
		);

		setFolders([...newFolders, newFolder]);
	};

	const handleUpdateFolder = (parentFolder, newFolder) => {
		const newFolders = folders.map(
			folder =>
				(folder.id === parentFolder.id && parentFolder) ||
				(folder.id === newFolder.id && newFolder) ||
				folder,
		);

		setFolders(newFolders);
	};

	const handleDeleteSharedFile = id => {
		setShared(shared.filter(item => item.file.id !== id));
	};

	useEffect(() => {
		const controller = new AbortController();
		const { signal } = controller;

		const getFolders = async () => {
			let url = `${import.meta.env.VITE_RESOURCE_URL}/api/folders`;

			const options = {
				method: 'GET',
				signal,
				credentials: 'include',
			};

			return await handleFetch(url, options);
		};

		const getSharedFiles = async signal => {
			let url = `${import.meta.env.VITE_RESOURCE_URL}/api/sharedFiles`;

			const options = {
				method: 'GET',
				signal,
				credentials: 'include',
			};

			return await handleFetch(url, options);
		};

		const handleGetLists = async () => {
			setLoading(true);

			const [sharedFiles, folders] = await Promise.all([
				getSharedFiles(),
				getFolders(),
			]);

			const handleResult = async () => {
				folders.success ? setFolders(folders.data) : setError(folders.message);
				sharedFiles.success
					? setShared(sharedFiles.data)
					: setError(sharedFiles.message);
				setLoading(false);
			};

			folders && sharedFiles && handleResult();
		};

		handleGetLists();
		return () => controller.abort();
	}, []);

	useEffect(() => {
		const getParentFolderIds = (result, id, folders) => {
			const index = folders.findIndex(folder => folder.id === id);
			const subfolder = index !== -1 ? folders.splice(index, 1)[0] : folders[0];

			const currentFolderPath = subfolder.id === folderId;
			const inFilePath = fileId;

			return id
				? subfolder.parent === null
					? [
							{
								name: subfolder.name,
								path: '/drive',
							},
							...result,
						]
					: getParentFolderIds(
							currentFolderPath && !inFilePath
								? [...result]
								: [
										{
											name: subfolder.name,
											path: `/drive/folders/${subfolder.id}`,
										},
										...result,
									],
							subfolder.parent.id,
							folders,
						)
				: !inFilePath
					? []
					: [
							{
								name: subfolder.name,
								path: '/drive',
							},
						];
		};

		const handleSet = () => {
			const paths = getParentFolderIds([], folderId, [...folders]);
			setPaths(paths.slice(-3));
		};
		folders.length && handleSet();
	}, [folders, folderId, fileId, isSmallMobile]);

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
							{paths.length !== 0 && (
								<nav>
									<ul className={styles.paths}>
										{paths.map((item, i) => (
											<li key={`${item.path}`} className={styles['paths-item']}>
												<div className={styles['paths-wrap']}>
													<Link to={item.path} className={styles['paths-link']}>
														{item.name}
													</Link>
													{paths.length - 1 !== i && (
														<span className={styles['paths-icon']}>{'>'}</span>
													)}
												</div>
											</li>
										))}
									</ul>
								</nav>
							)}

							{!fileId && <h2>{folder.name}</h2>}
							<Outlet
								context={{
									folder,
									shared,
									onActiveMenu,
									onActiveModal,
									onGetFolder: handleGetFolder,
									onAddFolder: handleAddFolder,
									onFolders: setFolders,
									onUpdateFolder: handleUpdateFolder,
									onDeleteSharedFile: handleDeleteSharedFile,
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
