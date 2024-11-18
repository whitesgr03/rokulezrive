// Packages
import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { supabase } from '../../../../../utils/supabase_client';

// Styles
import folderStyles from '../Folder.module.css';

// Components
import { Loading } from '../../../../utils/Loading/Loading';

// Utils
import { handleFetch } from '../../../../../utils/handle_fetch';

export const FileDelete = ({ name, fileId, onUpdateFolder, onActiveModal }) => {
	const [loading, setLoading] = useState(false);

	const { pathname: previousPath } = useLocation();
	const navigate = useNavigate();

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

		const result = await handleFetch(url, options);

		result.success
			? onUpdateFolder(result.data)
			: navigate('/drive/error', {
					state: { error: result.message, previousPath },
				});

		setLoading(false);
		onActiveModal({ component: null });
	};

	return (
		<>
			{loading && <Loading text={'Deleting...'} light={true} shadow={true} />}
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
	);
};

FileDelete.propTypes = {
	name: PropTypes.string,
	fileId: PropTypes.string,
	onUpdateFolder: PropTypes.func,
	onActiveModal: PropTypes.func,
};
