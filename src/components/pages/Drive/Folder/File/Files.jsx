// Packages
import { Link, useOutletContext, Navigate } from 'react-router-dom';
import { format } from 'date-fns';
import { useState } from 'react';
import { useMediaQuery } from 'react-responsive';
import { supabase } from '../../../../../utils/supabase_client';

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

// Variables
const RESOURCE_URL =
	import.meta.env.MODE === 'production'
		? import.meta.env.VITE_RESOURCE_URL
		: import.meta.env.VITE_LOCAL_RESOURCE_URL;

export const Files = () => {
	const {
		folder,
		menu,
		onActiveMenu,
		onActiveModal,
		onUpdateFolder,
		downloading,
		onResetSVGAnimate,
	} = useOutletContext();
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);
	const [downloading, setDownloading] = useState(`url("${downloadingIcon}")`);

	const isNormalTablet = useMediaQuery({ minWidth: 700 });

	const handleGetResourceUrl = async ({ id, name }) => {
		const download = async url => {
			const blob = await new Promise(resolve =>
				fetch(url)
					.then(res => resolve(res.blob()))
					.catch(() => resolve(null)),
			);

			const handleDownload = downloadUrl => {
				const a = document.createElement('a');
				a.href = downloadUrl;
				a.download = name;
				a.click();
			};

			!blob
				? setError('File resource url cloud not be loaded')
				: handleDownload(URL.createObjectURL(blob));
		};

		const getResourceUrl = async () => {
			setLoading(true);

			const {
				data: {
					session: { access_token },
				},
			} = await supabase.auth.getSession();

			const url = `${RESOURCE_URL}/api/files/${id}/download-url`;

			const options = {
				method: 'GET',
				headers: {
					Authorization: `Bearer ${access_token}`,
				},
			};

			const result = await handleFetch(url, options);

			const handleSuccess = async () => {
				await download(result.data.url);
				onActiveMenu();
				setLoading(false);
				onResetSVGAnimate();
			};

			result.success ? handleSuccess() : setError(result.message);
		};

		!loading && getResourceUrl();
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
																	fileId={file.id}
																	onUpdateFolder={onUpdateFolder}
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
																	fileId={file.id}
																	onUpdateFolder={onUpdateFolder}
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
																	fileId={file.id}
																	onUpdateFolder={onUpdateFolder}
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
