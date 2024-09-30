import { useOutletContext } from 'react-router-dom';

// Styles
import styles from './Folder.module.css';
import { icon } from '../../../../styles/icon.module.css';

// Components
import { Subfolders } from './Subfolders';
import { Files } from './Files';
import { Folder_Create } from './Folder_Create';

export const Folder = () => {
	const { folder, menu, onActiveMenu, onActiveModal, onGetFolder } =
		useOutletContext();

	return (
		<>
			{!folder.children.length && !folder.files.length ? (
				<p className={styles.text}>No files in the folder</p>
			) : (
				<>
					{folder.children.length > 0 && <Subfolders />}
					{folder.files.length > 0 && <Files />}
				</>
			)}
			<div className={`upload ${styles.upload}`}>
				<button
					type="button"
					className={styles['upload-button']}
					onClick={() =>
						onActiveMenu({
							name: 'upload-menu',
							button: 'upload-button',
						})
					}
					data-button="upload-button"
				>
					<span className={`${icon} ${styles.plus}`} />
				</button>
				{menu.name === 'upload-menu' && (
					<ul className={`upload-menu ${styles['upload-menu']}`}>
						<li>
							<button
								className={styles['upload-link']}
								data-close-menu
							>
								<span className={`${icon} ${styles['upload-file']}`} />
								Upload File
							</button>
						</li>
						<li>
							<button
								className={styles['upload-link']}
								onClick={() =>
									onActiveModal({
										component: (
											<Folder_Create
												parentId={folder.id}
												onGetFolder={onGetFolder}
												onActiveModal={onActiveModal}
											/>
										),
									})
								}
								data-close-menu
							>
								<span className={`${icon} ${styles['create-folder']}`} />
								Create Folder
							</button>
						</li>
					</ul>
				)}
			</div>
		</>
	);
};
