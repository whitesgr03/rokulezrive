// Packages
import {
	useOutletContext,
	useParams,
	Navigate,
	useLocation,
} from 'react-router-dom';
import { format } from 'date-fns';
import { useState } from 'react';
import { supabase } from '../../../../../utils/supabase_client';

// Styles
import { icon } from '../../../../../styles/icon.module.css';
import formStyles from '../../../../../styles/form.module.css';
import driveStyles from '../../Drive.module.css';

// Utils
import { formatBytes } from '../../../../../utils/format_bytes';
// Utils
import {
	handleFetch,
	handleFetchBlob,
} from '../../../../../utils/handle_fetch';
import { createDownloadElement } from '../../../../../utils/create_download_element';

export const FileInfo = () => {
	const { folder, downloading, onResetSVGAnimate } = useOutletContext();
	const { fileId } = useParams();

	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);

	const { pathname: previousPath } = useLocation();

	const file = folder.files.find(file => file.id === fileId);

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

		const result = await handleFetch(url, options);

		const handleDownload = async url => {
			const result = await handleFetchBlob(url);
			onResetSVGAnimate();

			result.success
				? createDownloadElement(result.blob, file.name).click()
				: navigate('/drive/error', {
						state: {
							error: 'File resource url cloud not be loaded',
							previousPath,
						},
					});
		};

		result.success
			? await handleDownload(result.data.url)
			: navigate('/drive/error', {
					state: {
						error: result.message,
						previousPath,
					},
				});

		setLoading(false);
	};

	return (
		<>
			{error ? (
				<Navigate to="/drive/error" state={{ error, previousPath }} />
			) : (
				<div className={driveStyles['file-container']}>
					<p className={driveStyles['file-name']} title={file.name}>
						{file.name}
					</p>
					<div className={driveStyles.file}>
						<span
							className={`${icon} ${driveStyles['file-icon']} ${driveStyles[`${file.type}`]}`}
						/>
					</div>
					<div className={driveStyles['file-info']}>
						<p>Size: {formatBytes(file.size)}</p>
						<p>Create At: {format(file.createdAt, 'MMM d, y')}</p>
					</div>
					<button
						className={`${formStyles['form-submit']} ${driveStyles['download-btn']}`}
						onClick={() =>
							handleGetResourceUrl({ id: fileId, name: file.name })
						}
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
