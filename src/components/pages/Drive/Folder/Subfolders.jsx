import { Link, useOutletContext } from 'react-router-dom';
import { format } from 'date-fns';

import driveStyles from '../Drive.module.css';
import { icon } from '../../../../styles/icon.module.css';
import styles from './Subfolders.module.css';

// Components
import { Folder_Update } from './Folder_Update';
import { Folder_Delete } from './Folder_Delete';

export const Subfolders = () => {
	const { folder, menu, onActiveMenu, onActiveModal, onGetFolder } =
		useOutletContext();

	const data = folder.children;

	return (
		<>
			<h3>Folders</h3>
			<ul className={driveStyles.list}>
				{data.map(file => (
					<li key={file.id} className={driveStyles.item}>
						<Link
							to={`/drive/folders/${file.id}`}
							className={driveStyles.container}
						>
							<span className={`${icon} ${styles.folder}`} />

							<div className={driveStyles.content}>
								<p className={driveStyles.name}>{file.name}</p>
								<div className={driveStyles['info-wrap']}>
									<div className={driveStyles.info}>
										<span className={`${icon} ${driveStyles.calendar}`} />
										<span className={driveStyles.date}>
											{format(file.createdAt, 'MMM d, y')}
										</span>
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
									<li>
										<button
											type="button"
											className={driveStyles['option-menu-button']}
											onClick={() =>
												onActiveModal({
													component: (
														<Folder_Update
															name={file.name}
															folderId={file.id}
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
														<Folder_Delete
															name={file.name}
															folderId={file.id}
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
