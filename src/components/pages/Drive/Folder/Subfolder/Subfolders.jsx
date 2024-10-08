import { Link, useOutletContext } from 'react-router-dom';
import { format } from 'date-fns';

import driveStyles from '../../Drive.module.css';
import { icon } from '../../../../../styles/icon.module.css';
import styles from './Subfolders.module.css';

// Components
import { Folder_Update } from './Folder_Update';
import { Folder_Delete } from './Folder_Delete';

export const Subfolders = () => {
	const {
		folder,
		menu,
		onActiveMenu,
		onActiveModal,
		onGetFolder,
		onUpdateFolder,
	} = useOutletContext();

	return (
		<>
			<h3>Folders</h3>
			<ul className={driveStyles.list}>
				{folder.subfolders.map(subfolder => (
					<li key={subfolder.id} className={driveStyles.item}>
						<Link
							to={`/drive/folders/${subfolder.id}`}
							className={driveStyles.container}
						>
							<span className={`${icon} ${styles.folder}`} />

							<div className={driveStyles.content}>
								<p className={driveStyles.name}>{subfolder.name}</p>
								<div className={driveStyles['info-wrap']}>
									<div className={driveStyles.info}>
										<span className={`${icon} ${driveStyles.calendar}`} />
										<span>{format(subfolder.createdAt, 'MMM d, y')}</span>
									</div>
								</div>
							</div>
						</Link>
						<div className={driveStyles.options}>
							<button
								onClick={() =>
									onActiveMenu({
										id: subfolder.id,
										button: 'option-button',
										name: 'option-menu',
									})
								}
								data-id={subfolder.id}
								data-button="option-button"
							>
								<span className={`${icon} ${driveStyles.option}`} />
							</button>
							{menu.name === 'option-menu' && menu.id === subfolder.id && (
								<ul className={`option-menu ${driveStyles['option-menu']}`}>
									<li>
										<button
											type="button"
											className={driveStyles['option-menu-button']}
											onClick={() =>
												onActiveModal({
													component: (
														<Folder_Update
															name={subfolder.name}
															folderId={subfolder.id}
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
														<Folder_Delete
															name={subfolder.name}
															subfolders={folder.subfolders}
															parentId={folder.id}
															folderId={subfolder.id}
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
