// Packages
import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import PropTypes from 'prop-types';

// folderStyles
import folderStyles from './Folder/Folder.module.css';

// Components
import { Loading } from '../../utils/Loading/Loading';

// Utils
import { handleFetch } from '../../../utils/handle_fetch';

export const Shared_Delete = ({
	name,
	sharedFileId,
	onDeleteSharedFile,
	onActiveModal,
}) => {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);

	const handleDeleteFile = async () => {
		setLoading(true);

		const url = `${import.meta.env.VITE_RESOURCE_URL}/api/sharedFiles/${sharedFileId}`;

		const options = {
			method: 'DELETE',
			credentials: 'include',
		};

		const handleSuccess = async () => {
			onDeleteSharedFile(sharedFileId);
			setLoading(false);
			onActiveModal({ component: null });
		};

		const result = await handleFetch(url, options);

		result.success ? handleSuccess() : setError(result.message);
	};

	return (
		<>
			{error ? (
				<Navigate to="/error" state={{ error }} />
			) : (
				<>
					{loading && (
						<Loading text={'Stopping...'} light={true} shadow={true} />
					)}
					<div className={folderStyles['folder-delete']}>
						<h3>Stop sharing file</h3>
						<div className={folderStyles.container}>
							<p>Do you really want to unshare?</p>
							<p className={folderStyles.name}>{`"${name}"`}</p>
							<div className={folderStyles['folder-button-wrap']}>
								<button
									className={`${folderStyles['folder-button']} ${folderStyles.cancel}`}
									data-close-modal
								>
									Cancel
								</button>
								<button
									className={`${folderStyles['folder-button']} ${folderStyles.delete}`}
									onClick={handleDeleteFile}
								>
									Stop
								</button>
							</div>
						</div>
					</div>
				</>
			)}
		</>
	);
};

Shared_Delete.propTypes = {
	name: PropTypes.string,
	sharedFileId: PropTypes.string,
	onDeleteSharedFile: PropTypes.func,
	onActiveModal: PropTypes.func,
};
