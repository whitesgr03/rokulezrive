// Packages
import {
	useOutletContext,
	useParams,
	Navigate,
	useLocation,
} from 'react-router-dom';
import { format } from 'date-fns';
import { useState } from 'react';
import { supabase } from '../../../utils/supabase_client';

// Styles
import { icon } from '../../../styles/icon.module.css';
import driveStyles from './Drive.module.css';
import formStyles from '../../../styles/form.module.css';

// Utils
import { handleFetch, handleFetchBlob } from '../../../utils/handle_fetch';
import { formatBytes } from '../../../utils/format_bytes';
import { createDownloadElement } from '../../../utils/create_download_element';

export const SharedFile = () => {
	const { sharedFiles, downloading, onResetSVGAnimate } = useOutletContext();
	const { fileId } = useParams();
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);

	const { pathname: previousPath } = useLocation();

	const sharedFile = sharedFiles.find(item => item.file.id === fileId);

	const handleGetResourceUrl = async () => {
		setLoading(true);

		const {
			data: {
				session: { access_token },
			},
		} = await supabase.auth.getSession();

		const url = `${import.meta.env.VITE_RESOURCE_URL}/api/files/${fileId}/download-url`;

		const options = {
			method: 'GET',
			headers: {
				Authorization: `Bearer ${access_token}`,
			},
		};

		const handleDownload = async url => {
			const result = await handleFetchBlob(url);
			onResetSVGAnimate();

			result.success
				? createDownloadElement(result.blob, sharedFile.file.name).click()
				: setError('File resource url cloud not be loaded.');
		};

		const result = await handleFetch(url, options);

		result.success
			? await handleDownload(result.data.url)
			: setError(result.message);

		setLoading(false);
	};

	return (
		<>
			{error || !sharedFile ? (
				<Navigate
					to="/drive/error"
					state={{
						error: !sharedFile
							? 'The file you are looking for could not be found.'
							: error,
						previousPath,
						customMessage: !sharedFile,
					}}
				/>
			) : (
				<div className={driveStyles['file-container']}>
					<p className={driveStyles['file-name']} title={sharedFile.file.name}>
						{sharedFile.file.name}
					</p>
					<div className={driveStyles.file}>
						<span
							className={`${icon} ${driveStyles['file-icon']} ${driveStyles[`${sharedFile.file.type}`]}`}
						/>
					</div>
					<div className={driveStyles['file-info']}>
						<p>Size: {formatBytes(sharedFile.file.size)}</p>
						<p>Shared by: {sharedFile.file.owner.email}</p>
						<p>Shared At: {format(sharedFile.sharedAt, 'MMM d, y')}</p>
					</div>
					<button
						className={`${formStyles['form-submit']} ${driveStyles['download-btn']}`}
						onClick={() => !loading && handleGetResourceUrl()}
					>
						<span className={`${driveStyles['download-text']}`}>
							Download
							{loading && (
								<span
									style={{
										maskImage: downloading,
									}}
									className={`${icon} ${driveStyles['downloading']} ${driveStyles['download-icon']}`}
								></span>
							)}
						</span>
					</button>
				</div>
			)}
		</>
	);
};
