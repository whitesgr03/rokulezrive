// Packages
import {
	Outlet,
	useOutletContext,
	Navigate,
	useParams,
	Link,
} from 'react-router-dom';
import { useEffect, useState, Fragment } from 'react';
import { useMediaQuery } from 'react-responsive';
import { supabase } from '../../../utils/supabase_client';

// Styles
import { icon } from '../../../styles/icon.module.css';
import uploadListStyles from './Upload_List.module.css';
import styles from './Drive.module.css';

// Components
import { Loading } from '../../utils/Loading/Loading';
import { UploadList } from './Upload_List';
import { Navbar } from '../../layout/Navbar/Navbar';
import { Footer } from '../../layout/Footer/Footer';

// Utils
import { handleFetch } from '../../../utils/handle_fetch';

// Variables
const downloadingIcon = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1em' height='1em' viewBox='0 0 24 24'%3E%3Cg fill='none' stroke='%23000' stroke-linecap='round' stroke-linejoin='round' stroke-width='2'%3E%3Cpath stroke-dasharray='2 4' stroke-dashoffset='6' d='M12 3c4.97 0 9 4.03 9 9c0 4.97 -4.03 9 -9 9'%3E%3Canimate attributeName='stroke-dashoffset' dur='0.6s' repeatCount='indefinite' values='6;0'/%3E%3C/path%3E%3Cpath stroke-dasharray='32' stroke-dashoffset='32' d='M12 21c-4.97 0 -9 -4.03 -9 -9c0 -4.97 4.03 -9 9 -9'%3E%3Canimate fill='freeze' attributeName='stroke-dashoffset' begin='0.1s' dur='0.4s' values='32;0'/%3E%3C/path%3E%3Cpath stroke-dasharray='10' stroke-dashoffset='10' d='M12 8v7.5'%3E%3Canimate fill='freeze' attributeName='stroke-dashoffset' begin='0.5s' dur='0.2s' values='10;0'/%3E%3C/path%3E%3Cpath stroke-dasharray='6' stroke-dashoffset='6' d='M12 15.5l3.5 -3.5M12 15.5l-3.5 -3.5'%3E%3Canimate fill='freeze' attributeName='stroke-dashoffset' begin='0.7s' dur='0.2s' values='6;0'/%3E%3C/path%3E%3C/g%3E%3C/svg%3E#123`;

export const Drive = () => {
	const { folderId, fileId } = useParams();
	const { onActiveMenu, onActiveModal, menu } = useOutletContext();

	const isNormalTablet = useMediaQuery({ minWidth: 700 });
	const isDesktop = useMediaQuery({ minWidth: 1024 });

	const [folders, setFolders] = useState([]);
	const [sharedFiles, setSharedFiles] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [downloading, setDownloading] = useState(`url("${downloadingIcon}")`);

	const folder = folderId
		? folders.find(folder => folder.id === folderId)
		: folders[0];

	const handleResetSVGAnimate = () => {
		setDownloading(`url("${downloadingIcon}#${Math.random()}")`);
	};

	const handleUpdateFolder = ({ parentFolder, currentFolder, newFolder }) => {
		const newFolders = folders.map(
			folder =>
				(folder.id === parentFolder?.id && parentFolder) ||
				(folder.id === currentFolder.id && currentFolder) ||
				folder,
		);

		setFolders(newFolder ? [...newFolders, newFolder] : newFolders);
	};

	const handleDeleteSharedFile = id => {
		setSharedFiles(sharedFiles.filter(item => item.file.id !== id));
	};

	const createPaths = (result, id, folders) => {
		const index = folders.findIndex(folder => folder.id === id);
		const subfolder = index !== -1 ? folders.splice(index, 1)[0] : folders[0];

		return id
			? subfolder.parent === null
				? [
						{
							name: subfolder.name,
							path: '/drive',
						},
						...result,
					]
				: createPaths(
						[
							{
								name: subfolder.name,
								path: `/drive/folders/${subfolder.id}`,
							},
							...result,
						],
						subfolder.parent.id,
						folders,
					)
			: !fileId
				? []
				: [
						{
							name: subfolder.name,
							path: '/drive',
						},
					];
	};

	const paths =
		folders.length &&
		createPaths([], folderId, [...folders]).slice(
			isDesktop ? -4 : isNormalTablet ? -3 : -2,
		);

	useEffect(() => {
		const controller = new AbortController();
		const { signal } = controller;

		const getFolders = async access_token => {
			let url = `${import.meta.env.VITE_RESOURCE_URL}/api/folders`;

			const options = {
				method: 'GET',
				headers: {
					Authorization: `Bearer ${access_token}`,
				},
				signal,
			};

			return await handleFetch(url, options);
		};

		const getSharedFiles = async access_token => {
			let url = `${import.meta.env.VITE_RESOURCE_URL}/api/sharedFiles`;

			const options = {
				method: 'GET',
				headers: {
					Authorization: `Bearer ${access_token}`,
				},
				signal,
			};

			return await handleFetch(url, options);
		};

		const handleGetLists = async () => {
			const {
				data: {
					session: { access_token },
				},
			} = await supabase.auth.getSession();

			const [shared, folders] = await Promise.all([
				getSharedFiles(access_token),
				getFolders(access_token),
			]);

			const handleResult = async () => {
				folders.success ? setFolders(folders.data) : setError(folders.message);
				shared.success ? setSharedFiles(shared.data) : setError(shared.message);
				setLoading(false);
			};

			folders && shared && handleResult();
		};

		handleGetLists();
		return () => controller.abort();
	}, []);

	return (
		<>
			{error ? (
				<Navigate to="/error" state={{ error }} />
			) : (
				<>
					{loading ? (
						<Loading text="Loading..." />
					) : (
						<>
							{isNormalTablet && (
								<div className={styles.sidebar}>
									<UploadList
										folderId={folder.id}
										onActiveModal={onActiveModal}
										onUpdateFolder={handleUpdateFolder}
									/>
									<Navbar />
								</div>
							)}
							<div className={styles['wrap-bgc']}>
								<div className={styles.drive}>
									<div className={styles.content}>
										{paths.length !== 0 && (
											<nav>
												<div className={styles.paths}>
													{paths.map((item, i) => (
														<Fragment key={`${item.path}`}>
															{i !== 0 && (
																<span className={`${styles.arrow}`} />
															)}
															<Link
																to={item.path}
																className={styles['paths-link']}
																title={item.name}
															>
																{item.name}
															</Link>
														</Fragment>
													))}
												</div>
											</nav>
										)}

										{!folderId && !fileId && <h2>{folder.name}</h2>}
										<Outlet
											context={{
												folders,
												folder,
												sharedFiles,
												onActiveMenu,
												onActiveModal,
												onUpdateFolder: handleUpdateFolder,
												onDeleteSharedFile: handleDeleteSharedFile,
												menu,
												downloading,
												onResetSVGAnimate: handleResetSVGAnimate,
											}}
										/>
									</div>
									{isNormalTablet && <Footer />}
								</div>
							</div>
							{!isNormalTablet && (
								<div className={`upload ${uploadListStyles.upload}`}>
									<button
										type="button"
										className={uploadListStyles['upload-button']}
										onClick={() =>
											onActiveMenu({
												name: 'upload-menu',
												button: 'upload-button',
											})
										}
										data-button="upload-button"
									>
										<span className={`${icon} ${uploadListStyles.plus}`} />
									</button>
									{menu.name === 'upload-menu' && (
										<UploadList
											folderId={folder.id}
											onActiveModal={onActiveModal}
											onUpdateFolder={handleUpdateFolder}
										/>
									)}
								</div>
							)}
						</>
					)}
				</>
			)}
		</>
	);
};
