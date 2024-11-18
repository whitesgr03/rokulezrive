// Packages
import {
	Link,
	useOutletContext,
	Navigate,
	useLocation,
} from 'react-router-dom';
import { format } from 'date-fns';
import { useState } from 'react';
import { useMediaQuery } from 'react-responsive';
import { supabase } from '../../../../../utils/supabase_client';
import PropTypes from 'prop-types';

// Styles
import driveStyles from '../../Drive.module.css';
import { icon } from '../../../../../styles/icon.module.css';
import styles from './Files.module.css';

// Components
import { FileUpdate } from './File_Update';
import { FileDelete } from './File_Delete';
import { FileShare } from './File_Share';

// Utils
import { formatBytes } from '../../../../../utils/format_bytes';
import { handleFetch } from '../../../../../utils/handle_fetch';




export const Files = ({ files }) => {
	const {
		menu,
		onActiveMenu,
		onActiveModal,
		onUpdateFolder,
		downloading,
		onResetSVGAnimate,
	} = useOutletContext();
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);

	const { pathname: previousPath } = useLocation();
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

		const url = `${import.meta.env.VITE_RESOURCE_URL}/api/files/${id}/download-url`;

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
				<Navigate to="/drive/error" state={{ error, previousPath }} />
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
						{files.map(file => (
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
												button: 'options-button',
												name: 'options-menu',
											})
										}
										className={driveStyles['options-button']}
										data-id={file.id}
										data-button="options-button"
									>
										<span className={`${icon} ${driveStyles.option}`} />
									</button>
									{menu.name === 'options-menu' && menu.id === file.id && (
										<ul
											className={`options-menu ${driveStyles['options-menu']}`}
										>
											<li>
												<button
													type="button"
													className={driveStyles['options-menu-button']}
													onClick={() =>
														onActiveModal({
															component: (
																<FileShare
																	name={file.name}
																	sharers={file.sharers}
																	publicId={file.public ? file.public.id : ''}
																	fileId={file.id}
																	onUpdateFolder={onUpdateFolder}
																	onActiveModal={onActiveModal}
																/>
															),
														})
													}
												>
													<span className={`${icon} ${driveStyles.share}`} />
													Share
												</button>
											</li>

											<li>
												<button
													className={driveStyles['options-menu-button']}
													onClick={() =>
														!loading &&
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
													className={driveStyles['options-menu-button']}
													onClick={() =>
														onActiveModal({
															component: (
																<FileUpdate
																	name={file.name}
																	fileId={file.id}
																	onUpdateFolder={onUpdateFolder}
																	onActiveModal={onActiveModal}
																/>
															),
														})
													}
												>
													<span className={`${icon} ${driveStyles.edit}`} />
													Rename
												</button>
											</li>
											<li>
												<button
													type="button"
													className={driveStyles['options-menu-button']}
													onClick={() =>
														onActiveModal({
															component: (
																<FileDelete
																	name={file.name}
																	fileId={file.id}
																	onUpdateFolder={onUpdateFolder}
																	onActiveModal={onActiveModal}
																/>
															),
														})
													}
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

Files.propTypes = {
	files: PropTypes.array,
};
