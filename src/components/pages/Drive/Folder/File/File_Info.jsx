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
import { handleFetch } from '../../../../../utils/handle_fetch';

// Variables
const RESOURCE_URL =
	import.meta.env.MODE === 'production'
		? import.meta.env.VITE_RESOURCE_URL
		: import.meta.env.VITE_LOCAL_RESOURCE_URL;

export const File_Info = () => {
	const { folder, downloading, onResetSVGAnimate } = useOutletContext();
	const { fileId } = useParams();

	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);

	const { pathname: previousPath } = useLocation();

	const file = folder.files.find(file => file.id === fileId);

	const handleGetResourceUrl = async ({ id, name }) => {
		const download = async url => {
			const blob = await new Promise(resolve =>
				fetch(url)
					.then(res => resolve(res.blob()))
					.catch(() => resolve(null)),
			);

			const handleDownload = downloadUrl => {
				const a = document.createElement('a');
				a.href = downloadUrl;
				a.download = name;
				a.click();
			};

			!blob
				? setError('File resource url cloud not be loaded')
				: handleDownload(URL.createObjectURL(blob));
		};

		const getResourceUrl = async () => {
			setLoading(true);

			const {
				data: {
					session: { access_token },
				},
			} = await supabase.auth.getSession();

			const url = `${RESOURCE_URL}/api/files/${id}/download-url`;

			const options = {
				method: 'GET',
				headers: {
					Authorization: `Bearer ${access_token}`,
				},
			};

			const result = await handleFetch(url, options);

			const handleSuccess = async () => {
				await download(result.data.url);
				setLoading(false);
				onResetSVGAnimate();
			};

			result.success ? handleSuccess() : setError(result.message);
		};

		!loading && getResourceUrl();
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
