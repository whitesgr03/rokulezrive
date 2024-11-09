// Packages
import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { supabase } from '../../../../../utils/supabase_client';

// folderStyles
import folderStyles from '../Folder.module.css';
import formStyles from '../../../../../styles/form.module.css';
import { icon } from '../../../../../styles/icon.module.css';
import styles from './Folder_Delete.module.css';

// Components
import { Loading } from '../../../../utils/Loading/Loading';

// Utils
import { handleFetch } from '../../../../../utils/handle_fetch';
import { getAllDeletedFolderSubfolderIds } from '../../../../../utils/getAllDeletedFolderSubfolderIds';

const RESOURCE_URL =
	import.meta.env.MODE === 'production'
		? import.meta.env.VITE_RESOURCE_URL
		: import.meta.env.VITE_LOCAL_RESOURCE_URL;

export const Folder_Delete = ({
	folders,
	folder,
	onUpdateFolder,
	onActiveModal,
}) => {
	const [loading, setLoading] = useState(false);

	const navigate = useNavigate();
	const { pathname: previousPath } = useLocation();

	const { name, id, _count } = folder;
	const folderIsEmpty = _count.subfolders + _count.files === 0;

	const handleDeleteFolder = async () => {
		setLoading(true);

		const {
			data: {
				session: { access_token },
			},
		} = await supabase.auth.getSession();

		const url = `${RESOURCE_URL}/api/folders/${id}`;

		const options = {
			method: 'DELETE',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${access_token}`,
			},
		};

		const allFolderIdsWithFiles =
			!folderIsEmpty &&
			getAllDeletedFolderSubfolderIds([{ id, _count }], [...folders], [])
				.filter(folder => folder._count.files)
				.map(folder => folder.id);

		allFolderIdsWithFiles?.length &&
			(options.body = JSON.stringify({ folderIds: allFolderIdsWithFiles }));

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
	);
};

Folder_Delete.propTypes = {
	folders: PropTypes.array,
	folder: PropTypes.object,
	onUpdateFolder: PropTypes.func,
	onActiveModal: PropTypes.func,
};
