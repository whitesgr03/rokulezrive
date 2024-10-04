// Packages
import { useParams } from 'react-router-dom';
import { format } from 'date-fns';
import { useState, useEffect } from 'react';

// Styles
import { icon } from '../../../styles/icon.module.css';
import formStyles from '../../../styles/form.module.css';
import driveStyles from '../Drive/Drive.module.css';
import styles from './Public_File.module.css';

// Components
import { Loading } from '../../utils/Loading/Loading';
import { Error } from '../../utils/Error/Error';

// Utils
import { formatBytes } from '../../../utils/format_bytes';
import { handleFetch } from '../../../utils/handle_fetch';

export const Public_File = () => {
	const { shareId } = useParams();
	const [file, setFile] = useState({});
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		const controller = new AbortController();
		const { signal } = controller;

		const getFileDownloadUrl = async file => {
			const blob = await new Promise(resolve =>
				fetch(file.secure_url)
					.then(res => resolve(res.blob()))
					.catch(() => resolve(null)),
			);

			return {
				...file,
				download_url: blob === null ? '' : URL.createObjectURL(blob),
			};
		};

		const handleGetSharedFile = async () => {
			setLoading(true);
			let url = `${import.meta.env.VITE_RESOURCE_URL}/api/shared/${shareId}`;

			console.log(shareId);

			const options = {
				method: 'GET',
				signal,
				credentials: 'include',
			};

			const result = await handleFetch(url, options);

			console.log(result);

			const handleResult = async () => {
				result.success
					? setFile(await getFileDownloadUrl(result.data))
					: setError(result);
				setLoading(false);
			};

			result && handleResult();
		};

		handleGetSharedFile();
		return () => controller.abort();
	}, [shareId]);

	return (
		<div className={styles['public-file']}>
			{error ? (
				<Error error={error.message}>
					{error.code === 404 && (
						<p>The file you are looking for could not be found.</p>
					)}
					{error.code === 403 && (
						<p>
							The file is not public and can only be opened by people with
							access links.
						</p>
					)}
				</Error>
			) : (
				<>
					{loading ? (
						<Loading text="Loading..." />
					) : (
						<>
							<p>{file.name}</p>
							<div className={driveStyles.file}>
								<span
									className={`${icon} ${driveStyles['file-icon']} ${driveStyles.image}`}
								/>
							</div>
							<div className={driveStyles['file-info']}>
								<p>Size: {formatBytes(file.size)}</p>
								<p>Shared by: {file.owner.username}</p>
								<p>Shared At: {format(file.updatedAt, 'MMM d, y')}</p>
							</div>
							{file.download_url && (
								<a
									className={`${formStyles['form-submit']} ${driveStyles['file-link']}`}
									href={file.download_url}
									download={file.name}
								>
									Download
								</a>
							)}
						</>
					)}
				</>
			)}
		</div>
	);
};
