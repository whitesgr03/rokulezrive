// Packages
import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { supabase } from '../../../../../utils/supabase_client';

// Styles
import folderStyles from '../Folder.module.css';

// Components
import { Loading } from '../../../../utils/Loading/Loading';

// Utils
import { handleFetch } from '../../../../../utils/handle_fetch';

export const File_Delete = ({
	name,
	folderId,
	fileId,
	onGetFolder,
	onActiveModal,
}) => {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);

	const handleDeleteFile = async () => {
		setLoading(true);

		const {
			data: {
				session: { access_token },
			},
		} = await supabase.auth.getSession();

		const url = `${import.meta.env.VITE_RESOURCE_URL}/api/files/${fileId}`;

		const options = {
			method: 'DELETE',
			headers: {
				Authorization: `Bearer ${access_token}`,
			},
		};

		const handleSuccess = () => {
			onGetFolder(folderId);
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

File_Delete.propTypes = {
	name: PropTypes.string,
	folderId: PropTypes.string,
	fileId: PropTypes.string,
	onGetFolder: PropTypes.func,
	onActiveModal: PropTypes.func,
};
