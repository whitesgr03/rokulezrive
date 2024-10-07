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

	const handleDeleteSharedFile = id => {
		setShared(shared.filter(item => item.file.id !== id));
	};

	useEffect(() => {
		const controller = new AbortController();
		const { signal } = controller;

		const getSharedFilesDownloadUrls = async shared => {
			const blobs = await Promise.all(
				shared.map(
					async item =>
						new Promise(resolve =>
							fetch(item.file.secure_url)
								.then(res => resolve(res.blob()))
								.catch(() => resolve(null)),
						),
				),
			);

			const newShared = shared.map((item, i) => ({
				...item,
				file: {
					...item.file,
					download_url: blobs[i] === null ? '' : URL.createObjectURL(blobs[i]),
				},
			}));

			return newShared;
		};

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
					? setShared(await getSharedFilesDownloadUrls(sharedFiles.data))
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
			const subfolder = folders.splice(
				folders.findIndex(folder => folder.id === id),
				1,
			)[0];

			return !id
				? []
				: subfolder.parent === null
					? [
							{
								name: subfolder.name,
								path: '/drive',
							},
							...result,
						]
					: getParentFolderIds(
							subfolder.id === folderId && !fileId
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
						);
		};

		const handleSet = () => {
			const paths = getParentFolderIds([], folderId, [...folders]);
			setPaths(paths.slice(-3));
		};
		folders.length && handleSet();
	}, [folders, folderId, fileId, isSmallMobile]);

	useEffect(() => {
		const getAllFilesDownloadUrls = async currentFolder => {
			const blobs = await Promise.all(
				currentFolder.files.map(
					async file =>
						new Promise(resolve =>
							fetch(file.secure_url)
								.then(res => resolve(res.blob()))
								.catch(() => resolve(null)),
						),
				),
			);

			const newFiles = currentFolder.files.map((file, i) => ({
				...file,
				download_url: blobs[i] === null ? '' : URL.createObjectURL(blobs[i]),
			}));

			return newFiles;
		};

		const getFileDownloadUrl = async currentFolder => {
			const targetFile = currentFolder.files[currentFolder.files.length - 1];

			const blob = await new Promise(resolve =>
				fetch(targetFile.secure_url)
					.then(res => resolve(res.blob()))
					.catch(() => resolve(null)),
			);

			const newFiles = currentFolder.files.map(file =>
				file.id === targetFile.id
					? {
							...file,
							download_url: blob === null ? '' : URL.createObjectURL(blob),
						}
					: file,
			);

			return newFiles;
		};

		const handleSetDownloadUrls = async folder => {
			const firstFile = folder.files[0];
			const lastFile = folder.files[folder.files.length - 1];

			const newFiles =
				(!firstFile.download_url && (await getAllFilesDownloadUrls(folder))) ||
				(!lastFile.download_url && (await getFileDownloadUrl(folder)));

			newFiles &&
				setFolders(
					folders.map(subfolder =>
						subfolder.id === folder.id
							? { ...subfolder, files: newFiles }
							: subfolder,
					),
				);
		};

		folders.length && folder.files.length && handleSetDownloadUrls(folder);
	}, [folder, folders]);

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
