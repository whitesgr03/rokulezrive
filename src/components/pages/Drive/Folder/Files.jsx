// Packages
import { Link, useOutletContext } from 'react-router-dom';
import { useEffect } from 'react';
import { format } from 'date-fns';
import PropTypes from 'prop-types';

// Styles
import driveStyles from '../Drive.module.css';
import { icon } from '../../../../styles/icon.module.css';
import styles from './Files.module.css';

// Components
import { File_Update } from '../File_Update';
import { File_Delete } from '../File_Delete';
import { File_Share } from '../File_Share';

// Utils
import { formatBytes } from '../../../../utils/format_bytes';

export const Files = () => {
	const {
		folder,
		menu,
		onActiveMenu,
		onActiveModal,
		onSetDownloadUrl,
		onGetFolder,
	} = useOutletContext();

	useEffect(() => {
		const getDownloadUrls = async () => {
			const blobs = await Promise.all(
				folder.files.map(
					async file =>
						new Promise(resolve =>
							fetch(file.secure_url)
								.then(res => resolve(res.blob()))
								.catch(() => resolve(null)),
						),
				),
			);

			const data = folder.files.map((file, i) => ({
				...file,
				download_url: blobs[i] === null ? '' : URL.createObjectURL(blobs[i]),
			}));

			onSetDownloadUrl({
				id: folder.id,
				data,
			});
		};
		folder.files[0].download_url ?? getDownloadUrls();
	}, [onSetDownloadUrl, folder]);

	useEffect(() => {
		const getDownloadUrl = async () => {
			const target = folder.files[folder.files.length - 1];
			const blob = await new Promise(resolve =>
				fetch(target.secure_url)
					.then(res => resolve(res.blob()))
					.catch(() => resolve(null)),
			);

			const newData = folder.files.map(file =>
				file.id === target.id
					? {
							...file,
							download_url: blob === null ? '' : URL.createObjectURL(blob),
						}
					: file,
			);

			onSetDownloadUrl({
				id: folder.id,
				data: newData,
			});
		};

		folder.files[0].download_url &&
			!folder.files[folder.files.length - 1].download_url &&
			getDownloadUrl();
	}, [onSetDownloadUrl, folder]);
	return (
		<>
			<h3>Files</h3>
			<ul className={driveStyles.list}>
				{folder.files.map(file => (
					<li key={file.id} className={driveStyles.item}>
						<Link
							to={`/files/${file.id}`}
							relative="path"
							className={driveStyles.container}
						>
							<span className={`${icon} ${driveStyles.image}`} />
							<div className={driveStyles.content}>
								<p className={driveStyles.name}>{file.name}</p>
								<div className={driveStyles['info-wrap']}>
									<div className={driveStyles.info}>
										<span className={`${icon} ${styles.size}`} />
										<span className={driveStyles['file-content']}>
											{formatBytes(file.size)}
										</span>
									</div>

									<div className={driveStyles.info}>
										<span className={`${icon} ${driveStyles.calendar}`} />
										<span>{format(file.createdAt, 'MMM d, y')}</span>
									</div>
								</div>
							</div>
						</Link>
						<div className={driveStyles.options}>
							<button
								onClick={() =>
									onActiveMenu({
										id: file.id,
										button: 'option-button',
										name: 'option-menu',
									})
								}
								data-id={file.id}
								data-button="option-button"
							>
								<span className={`${icon} ${driveStyles.option}`} />
							</button>
							{menu.name === 'option-menu' && menu.id === file.id && (
								<ul className={`option-menu ${driveStyles['option-menu']}`}>
									<>
										<li>
											<button
												type="button"
												className={driveStyles['option-menu-button']}
												onClick={() =>
													onActiveModal(<File_Share name={file.name} />)
												}
												data-close-menu
											>
												<span className={`${icon} ${driveStyles.share}`} />
												Share
											</button>
										</li>

										{file.download_url && (
											<li>
												<a
													className={driveStyles['option-menu-button']}
													href={file.download_url}
													download={file.name}
												>
													<span className={`${icon} ${driveStyles.download}`} />
													Download
												</a>
											</li>
										)}
									</>

									<li>
										<button
											type="button"
											className={driveStyles['option-menu-button']}
											onClick={() =>
												onActiveModal({
													component: (
														<File_Update
															name={file.name}
															folderId={folder.id}
															fileId={file.id}
															onGetFolder={onGetFolder}
															onActiveModal={onActiveModal}
														/>
													),
												})
											}
											data-close-menu
										>
											<span className={`${icon} ${driveStyles.edit}`} />
											Rename
										</button>
									</li>
									<li>
										<button
											type="button"
											className={driveStyles['option-menu-button']}
											onClick={() =>
												onActiveModal({
													component: (
														<File_Delete
															name={file.name}
															folderId={folder.id}
															fileId={file.id}
															onGetFolder={onGetFolder}
															onActiveModal={onActiveModal}
														/>
													),
												})
											}
											data-close-menu
										>
											<span className={`${icon} ${driveStyles.delete}`} />
											Remove
										</button>
									</li>
								</ul>
							)}
						</div>
					</li>
				))}
			</ul>
		</>
	);
};

Files.propTypes = {
	data: PropTypes.array,
	menu: PropTypes.object,
	onActiveMenu: PropTypes.func,
	onActiveModal: PropTypes.func,
};
