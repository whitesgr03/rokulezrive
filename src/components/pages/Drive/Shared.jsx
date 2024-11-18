// Packages
import {
	useOutletContext,
	Link,
	useMatch,
	Navigate,
	useLocation,
} from 'react-router-dom';
import { format } from 'date-fns';
import { useState } from 'react';
import { useMediaQuery } from 'react-responsive';
import { supabase } from '../../../utils/supabase_client';

// Styles
import driveStyles from './Drive.module.css';
import { icon } from '../../../styles/icon.module.css';
import styles from './Shared.module.css';

// Components
import { SharedDelete } from './Shared_Delete';

// Utils
import { handleFetch } from '../../../utils/handle_fetch';

export const Shared = () => {
	const {
		sharedFiles,
		menu,
		onActiveMenu,
		onActiveModal,
		onDeleteSharedFile,
		downloading,
		onResetSVGAnimate,
	} = useOutletContext();
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);

	const isNormalTablet = useMediaQuery({ minWidth: 700 });

	const matchPath = useMatch('/drive/shared');
	const { pathname: previousPath } = useLocation();

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
					{sharedFiles.length !== 0 ? (
						<>
							<h3 className={driveStyles.title}>Shared with you</h3>
							<ul className={driveStyles.list}>
								{isNormalTablet && (
									<li className={driveStyles.item}>
										<div
											className={`${driveStyles.container} ${driveStyles.head}`}
										>
											<div>Name</div>
											<div className={driveStyles.sharer}>Shared By</div>
											<div className={driveStyles.date}>Shared At</div>
										</div>
										<div className={driveStyles['options-button']} />
									</li>
								)}
								{sharedFiles.map(item => (
									<li key={item.file.id} className={driveStyles.item}>
										<Link
											to={`/drive/shared/${item.file.id}`}
											className={driveStyles.container}
										>
											<span
												className={`${icon} ${driveStyles[`${item.file.type}`]}`}
											/>
											<p className={driveStyles.name} title={item.file.name}>
												{item.file.name}
											</p>
											<div className={driveStyles.info}>
												{!isNormalTablet && (
													<span className={`${icon} ${styles['share-by']}`} />
												)}
												<span
													className={styles.sharer}
													title={item.file.owner.email}
												>
													{item.file.owner.email}
												</span>
											</div>
											<div className={driveStyles.info}>
												{!isNormalTablet && (
													<span className={`${icon} ${driveStyles.calendar}`} />
												)}
												{format(item.sharedAt, 'MMM d, y')}
											</div>
										</Link>
										<div className={driveStyles.options}>
											<button
												onClick={() =>
													onActiveMenu({
														id: item.file.id,
														button: 'option-button',
														name: 'option-menu',
													})
												}
												className={driveStyles['options-button']}
												data-id={item.file.id}
												data-button="option-button"
											>
												<span className={`${icon} ${driveStyles.option}`} />
											</button>
											{menu.name === 'option-menu' &&
												menu.id === item.file.id && (
													<ul
														className={`option-menu ${driveStyles['option-menu']}`}
													>
														<li>
															<button
																className={driveStyles['option-menu-button']}
																onClick={() =>
																	handleGetResourceUrl({
																		id: item.file.id,
																		name: item.file.name,
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
																			<SharedDelete
																				name={item.file.name}
																				sharedFileId={item.file.id}
																				onActiveModal={onActiveModal}
																				onDeleteSharedFile={onDeleteSharedFile}
																			/>
																		),
																	})
																}
															>
																<span
																	className={`${icon} ${driveStyles.unshare}`}
																/>
																Unshare
															</button>
														</li>
													</ul>
												)}
										</div>
									</li>
								))}
							</ul>
						</>
					) : (
						matchPath && (
							<p className={styles.text}>There are not files shared with you</p>
						)
					)}
				</>
			)}
		</>
	);
};
