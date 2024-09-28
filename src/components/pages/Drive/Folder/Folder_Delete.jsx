// Packages
import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import PropTypes from 'prop-types';

// Styles
import styles from './Folder_Delete.module.css';

// Components
import { Loading } from '../../../utils/Loading/Loading';

// Utils
import { handleFetch } from '../../../../utils/handleFetch';

export const Folder_Delete = ({
	name,
	folderId,
	onGetFolder,
	onActiveModal,
}) => {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);

	const handleDeleteFolder = async () => {
		setLoading(true);

		const url = `${import.meta.env.VITE_RESOURCE_URL}/api/folders/${folderId}`;

		const options = {
			method: 'DELETE',
			credentials: 'include',
		};

		const handleSuccess = () => {
			onGetFolder();
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
						<Loading text={'Creating...'} light={true} shadow={true} />
					)}
					<div className={styles['folder-delete']}>
						<h3>Delete Forever</h3>
						<div className={styles.container}>
							<p>Do you really want to delete?</p>
							<p>{`"${name}"`}</p>
							<div className={styles['folder-button-wrap']}>
								<button
									className={`${styles['folder-button']} ${styles.cancel}`}
									data-close-modal
								>
									Cancel
								</button>
								<button
									className={`${styles['folder-button']} ${styles.delete}`}
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
	folderId: PropTypes.string,
	onGetFolder: PropTypes.func,
	onActiveModal: PropTypes.func,
};
