// Packages
import {
	useOutletContext,
	useParams,
	Navigate,
	useLocation,
} from 'react-router-dom';
import { format } from 'date-fns';
import { useState, useEffect } from 'react';
import { supabase } from '../../../utils/supabase_client';

// Styles
import { icon } from '../../../styles/icon.module.css';
import driveStyles from './Drive.module.css';
import formStyles from '../../../styles/form.module.css';

// Components
import { Loading } from '../../utils/Loading/Loading';

// Utils
import { handleFetch } from '../../../utils/handle_fetch';
import { formatBytes } from '../../../utils/format_bytes';

// Variables
const RESOURCE_URL =
	import.meta.env.MODE === 'production'
		? import.meta.env.VITE_RESOURCE_URL
		: import.meta.env.VITE_LOCAL_RESOURCE_URL;

export const Shared_File = () => {
	const { sharedFiles, downloading, onResetSVGAnimate } = useOutletContext();
	const { fileId } = useParams();
	const [sharedFile, setSharedFile] = useState({});
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	const { pathname: previousPath } = useLocation();
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

		const createResourceUrl = async () => {
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

		!loading && createResourceUrl();
	};

	useEffect(() => {
		const sharedFile = sharedFiles.find(item => item.file.id === fileId);

		sharedFile
			? setSharedFile(sharedFile)
			: setError('The file you are looking for could not be found.');

		setLoading(false);
	}, [sharedFiles, fileId]);

	return (
		<>
			{error ? (
				<Navigate
					to="/drive/error"
					state={{ error, previousPath, customMessage: true }}
				/>
			) : (
				<div className={driveStyles['file-container']}>
					{loading ? (
						<Loading text="Loading..." />
					) : (
						<>
							<p
								className={driveStyles['file-name']}
								title={sharedFile.file.name}
							>
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
								onClick={() =>
									handleGetResourceUrl({
										id: fileId,
										name: sharedFile.file.name,
									})
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
						</>
					)}
				</div>
			)}
		</>
	);
};
