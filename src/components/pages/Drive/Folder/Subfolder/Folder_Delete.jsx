// Packages
import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import PropTypes from 'prop-types';

// folderStyles
import folderStyles from '../Folder.module.css';
import formStyles from '../../../../../styles/form.module.css';
import { icon } from '../../../../../styles/icon.module.css';
import styles from './Folder_Delete.module.css';

// Components
import { Loading } from '../../../../utils/Loading/Loading';

// Utils
import { handleFetch } from '../../../../../utils/handle_fetch';

export const Folder_Delete = ({
	name,
	subfolders,
	parentId,
	folderId,
	onGetFolder,
	onActiveModal,
}) => {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);

	const { _count } = subfolders.find(subfolder => subfolder.id === folderId);

	const folderIsEmpty = _count.subfolders + _count.files === 0;

	const handleDeleteFolder = async () => {
		setLoading(true);

		const url = `${import.meta.env.VITE_RESOURCE_URL}/api/folders/${folderId}`;

		const options = {
			method: 'DELETE',
			credentials: 'include',
		};

		const handleSuccess = () => {
			onGetFolder(parentId);
			onActiveModal({ component: null });
		};

		const result = await handleFetch(url, options);

		result.success ? handleSuccess() : setError(result.message);

		setLoading(false);
	};

	return (
		<>
			{error ? (
				<Navigate to="/error" state={{ error }} />
			) : (
				<>
					{loading && (
						<Loading text={'Deleting...'} light={true} shadow={true} />
					)}
					<div className={folderStyles['folder-delete']}>
						<h3>Delete Forever</h3>
						<div className={folderStyles.container}>
							<p>Do you really want to delete?</p>

							<p className={folderStyles.name}>{`"${name}"`}</p>
							{!folderIsEmpty && (
								<div className={styles.text}>
									<span className={`${icon} ${formStyles.alert}`} />
									<p>All files and subfolders will be deleted.</p>
								</div>
							)}
							<div className={folderStyles['folder-button-wrap']}>
								<button
									className={`${folderStyles['folder-button']} ${folderStyles.cancel}`}
									data-close-modal
								>
									Cancel
								</button>
								<button
									className={`${folderStyles['folder-button']} ${folderStyles.delete}`}
									onClick={handleDeleteFolder}
								>
									Delete
								</button>
							</div>
						</div>
					</div>
				</>
			)}
		</>
	);
};

Folder_Delete.propTypes = {
	name: PropTypes.string,
	subfolders: PropTypes.array,
	parentId: PropTypes.string,
	folderId: PropTypes.string,
	onGetFolder: PropTypes.func,
	onActiveModal: PropTypes.func,
};
