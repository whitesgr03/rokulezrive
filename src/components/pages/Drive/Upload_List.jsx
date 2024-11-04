// Packages
import PropTypes from 'prop-types';

// Components
import { Folder_Create } from './Folder/Subfolder/Folder_Create';
import { File_Upload } from './Folder/File/File_Upload';

// Styles
import { icon } from '../../../styles/icon.module.css';
import styles from './Upload_List.module.css';

export const Upload_List = ({ folderId, onActiveModal, onUpdateFolder }) => {
	return (
		<ul className={`upload-menu ${styles['upload-menu']}`}>
			<li className={styles['upload-item']}>
				<button
					className={styles['upload-link']}
					onClick={() =>
						onActiveModal({
							component: (
								<File_Upload
									folderId={folderId}
									onUpdateFolder={onUpdateFolder}
									onActiveModal={onActiveModal}
								/>
							),
						})
					}
					data-close-menu
				>
					<span className={`${icon} ${styles['upload-file']}`} />
					Upload File
				</button>
			</li>
			<li className={styles['upload-item']}>
				<button
					className={styles['upload-link']}
					onClick={() =>
						onActiveModal({
							component: (
								<Folder_Create
									folderId={folderId}
									onUpdateFolder={onUpdateFolder}
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
	);
};

Upload_List.propTypes = {
	folderId: PropTypes.string,
	onActiveModal: PropTypes.func,
	onUpdateFolder: PropTypes.func,
};
