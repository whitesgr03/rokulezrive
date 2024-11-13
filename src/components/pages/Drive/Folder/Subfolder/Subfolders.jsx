// Packages
import { Link, useOutletContext } from 'react-router-dom';
import { format } from 'date-fns';
import { useMediaQuery } from 'react-responsive';

// Styles
import driveStyles from '../../Drive.module.css';
import { icon } from '../../../../../styles/icon.module.css';
import styles from './Subfolders.module.css';

// Components
import { FolderUpdate } from './Folder_Update';
import { FolderDelete } from './Folder_Delete';

export const Subfolders = () => {
	const { folders, folder, menu, onActiveMenu, onActiveModal, onUpdateFolder } =
		useOutletContext();

	const isNormalTablet = useMediaQuery({ minWidth: 700 });

	return (
		<>
			<h3 className={driveStyles.title}>Folders</h3>
			<ul className={driveStyles.list}>
				{isNormalTablet && (
					<li className={driveStyles.item}>
						<div className={`${driveStyles.container} ${driveStyles.head}`}>
							<div>Name</div>
							<div className={driveStyles.date}>Created At</div>
						</div>
						<div className={driveStyles['options-button']} />
					</li>
				)}
				{folder.subfolders.map(subfolder => (
					<li key={subfolder.id} className={driveStyles.item}>
						<Link
							to={`/drive/folders/${subfolder.id}`}
							className={driveStyles.container}
						>
							<span className={`${icon} ${styles.folder}`} />
							<p
								className={`${driveStyles.name} ${driveStyles.span}`}
								title={subfolder.name}
							>
								{subfolder.name}
							</p>
							<div className={`${driveStyles.info} ${driveStyles.date}`}>
								{!isNormalTablet && (
									<span className={`${icon} ${driveStyles.calendar}`} />
								)}
								{format(subfolder.createdAt, 'MMM d, y')}
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
								className={driveStyles['options-button']}
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
														<FolderUpdate
															folder={subfolder}
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
														<FolderDelete
															folder={subfolder}
															folders={folders}
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
	);
};
