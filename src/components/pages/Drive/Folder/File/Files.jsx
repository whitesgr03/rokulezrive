// Packages
import { Link, useOutletContext, Navigate } from 'react-router-dom';
import { format } from 'date-fns';
import { useState } from 'react';
import { useMediaQuery } from 'react-responsive';

// Styles
import driveStyles from '../../Drive.module.css';
import { icon } from '../../../../../styles/icon.module.css';
import styles from './Files.module.css';

// Components
import { File_Update } from './File_Update';
import { File_Delete } from './File_Delete';
import { File_Share } from './File_Share';

// Utils
import { formatBytes } from '../../../../../utils/format_bytes';
import { handleFetch } from '../../../../../utils/handle_fetch';

export const Files = () => {
	const { folder, menu, onActiveMenu, onActiveModal, onGetFolder } =
		useOutletContext();
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);

	const isNormalTablet = useMediaQuery({ minWidth: 700 });

	const downloading = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1em' height='1em' viewBox='0 0 24 24'%3E%3Cg fill='none' stroke='%23000' stroke-linecap='round' stroke-linejoin='round' stroke-width='2'%3E%3Cpath stroke-dasharray='2 4' stroke-dashoffset='6' d='M12 3c4.97 0 9 4.03 9 9c0 4.97 -4.03 9 -9 9'%3E%3Canimate attributeName='stroke-dashoffset' dur='0.6s' repeatCount='indefinite' values='6;0'/%3E%3C/path%3E%3Cpath stroke-dasharray='32' stroke-dashoffset='32' d='M12 21c-4.97 0 -9 -4.03 -9 -9c0 -4.97 4.03 -9 9 -9'%3E%3Canimate fill='freeze' attributeName='stroke-dashoffset' begin='0.1s' dur='0.4s' values='32;0'/%3E%3C/path%3E%3Cpath stroke-dasharray='10' stroke-dashoffset='10' d='M12 8v7.5'%3E%3Canimate fill='freeze' attributeName='stroke-dashoffset' begin='0.5s' dur='0.2s' values='10;0'/%3E%3C/path%3E%3Cpath stroke-dasharray='6' stroke-dashoffset='6' d='M12 15.5l3.5 -3.5M12 15.5l-3.5 -3.5'%3E%3Canimate fill='freeze' attributeName='stroke-dashoffset' begin='0.7s' dur='0.2s' values='6;0'/%3E%3C/path%3E%3C/g%3E%3C/svg%3E#123#${Math.random()}")`;

	const handleGetResourceUrl = async ({ id, name }) => {
		const deleteResource = async data => {
			const url = `https://api.cloudinary.com/v1_1/${data.cloud_name}/delete_by_token`;

			const options = {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					token: data.delete_token,
				}),
			};

			const { result } = await handleFetch(url, options);
			result !== 'ok' && setError('Fail to delete resource');
		};

		const createDownloadUrl = async url => {
			const blob = await new Promise(resolve =>
				fetch(url, { cache: 'no-cache' })
					.then(res => resolve(res.blob()))
					.catch(() => resolve(null)),
			);

			const handleDownload = downloadUrl => {
				const a = document.createElement('a');
				a.href = downloadUrl;
				a.download = name;
				a.click();
			};

			!blob?.size
				? setError('File resource url cloud not be loaded')
				: handleDownload(URL.createObjectURL(blob));
		};

		const createResourceUrl = async () => {
			setLoading(true);
			const url = `${import.meta.env.VITE_RESOURCE_URL}/api/files/${id}/copy`;

			const options = {
				method: 'POST',
				headers: {
					'X-Requested-With': 'XmlHttpRequest',
				},
				credentials: 'include',
			};

			const result = await handleFetch(url, options);

			const handleSuccess = async () => {
				const { secure_url, ...data } = result.data;
				await createDownloadUrl(secure_url);
				setLoading(false);
				onActiveMenu();
				await deleteResource(data);
			};

			result.success ? handleSuccess() : setError(result.message);
		};

		!loading && createResourceUrl();
	};

	return (
		<>
			{error ? (
				<Navigate to="/error" state={{ error }} />
			) : (
				<>
					<h3 className={driveStyles.title}>Files</h3>
					<ul className={driveStyles.list}>
						{isNormalTablet && (
							<li className={driveStyles.item}>
								<div className={`${driveStyles.container} ${driveStyles.head}`}>
									<div>Name</div>
									<div className={driveStyles.size}>Size</div>
									<div className={driveStyles.date}>Created At</div>
								</div>
								<div className={driveStyles['options-button']} />
							</li>
						)}
						{folder.files.map(file => (
							<li key={file.id} className={driveStyles.item}>
								<Link to={`files/${file.id}`} className={driveStyles.container}>
									<span className={`${icon} ${driveStyles[`${file.type}`]}`} />
									<p className={driveStyles.name} title={file.name}>
										{file.name}
									</p>
									<div className={`${driveStyles.info}`}>
										{!isNormalTablet && (
											<span className={`${icon} ${styles.size}`} />
										)}
										{formatBytes(file.size)}
									</div>
									<div className={`${driveStyles.info}`}>
										{!isNormalTablet && (
											<span className={`${icon} ${driveStyles.calendar} `} />
										)}
										{format(file.createdAt, 'MMM d, y')}
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
										className={driveStyles['options-button']}
										data-id={file.id}
										data-button="option-button"
									>
										<span className={`${icon} ${driveStyles.option}`} />
									</button>
									{menu.name === 'option-menu' && menu.id === file.id && (
										<ul className={`option-menu ${driveStyles['option-menu']}`}>
											<li>
												<button
													type="button"
													className={driveStyles['option-menu-button']}
													onClick={() =>
														onActiveModal({
															component: (
																<File_Share
																	name={file.name}
																	sharers={file.sharers}
																	publicId={file.public ? file.public.id : ''}
																	folderId={folder.id}
																	fileId={file.id}
																	onGetFolder={onGetFolder}
																/>
															),
														})
													}
													data-close-menu
												>
													<span className={`${icon} ${driveStyles.share}`} />
													Share
												</button>
											</li>

											<li>
												<button
													className={driveStyles['option-menu-button']}
													onClick={() =>
														handleGetResourceUrl({
															id: file.id,
															name: file.name,
														})
													}
												>
													{loading ? (
														<span
															style={{
																maskImage: downloading,
															}}
															className={`${icon} ${driveStyles['downloading']}`}
														/>
													) : (
														<span
															className={`${icon} ${driveStyles.download}`}
														/>
													)}
													Download
												</button>
											</li>

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
			)}
		</>
	);
};
