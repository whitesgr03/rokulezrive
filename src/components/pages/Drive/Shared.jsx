// Packages
import { useOutletContext, Link, useMatch } from 'react-router-dom';
import { format } from 'date-fns';

// Styles
import driveStyles from './Drive.module.css';
import { icon } from '../../../styles/icon.module.css';
import styles from './Shared.module.css';

// Components
import { Shared_Delete } from './Shared_Delete';

export const Shared = () => {
	const { shared, menu, onActiveMenu, onActiveModal, onDeleteSharedFile } =
		useOutletContext();

	const matchPath = useMatch('/drive/shared');

	return (
		<>
			{shared.length !== 0 ? (
				<>
					<h3>Shared with you</h3>
					<ul className={driveStyles.list}>
						{shared.map(item => (
							<li key={item.file.id} className={driveStyles.item}>
								<Link
									to={`/drive/shared/${item.file.id}`}
									className={driveStyles.container}
								>
									<span
										className={`${icon} ${driveStyles[`${item.file.type}`]}`}
									/>
									<div className={driveStyles.content}>
										<p className={driveStyles.name}>{item.file.name}</p>
										<div className={driveStyles['info-wrap']}>
											<div className={driveStyles.info}>
												<span className={`${icon} ${styles['share-by']}`} />
												<span className={driveStyles['file-content']}>
													{item.file.owner.username}
												</span>
											</div>
											<div className={driveStyles.info}>
												<span className={`${icon} ${driveStyles.calendar}`} />
												<span>{format(item.sharedAt, 'MMM d, y')}</span>
											</div>
										</div>
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
										data-id={item.file.id}
										data-button="option-button"
									>
										<span className={`${icon} ${driveStyles.option}`} />
									</button>
									{menu.name === 'option-menu' && menu.id === item.file.id && (
										<ul className={`option-menu ${driveStyles['option-menu']}`}>
											{item.file.download_url && (
												<li>
													<a
														className={driveStyles['option-menu-button']}
														href={item.file.download_url}
														download={item.file.name}
													>
														<span
															className={`${icon} ${driveStyles.download}`}
														/>
														Download
													</a>
												</li>
											)}
											<li>
												<button
													type="button"
													className={driveStyles['option-menu-button']}
													onClick={() =>
														onActiveModal({
															component: (
																<Shared_Delete
																	name={item.file.name}
																	sharedFileId={item.file.id}
																	onActiveModal={onActiveModal}
																	onDeleteSharedFile={onDeleteSharedFile}
																/>
															),
														})
													}
												>
													<span className={`${icon} ${driveStyles.unshare}`} />
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
	);
};
