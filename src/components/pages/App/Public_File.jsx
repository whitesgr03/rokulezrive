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
	const { publicFileId } = useParams();
	const [data, setData] = useState({});
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		const controller = new AbortController();
		const { signal } = controller;

		const getFileDownloadUrl = async data => {
			const blob = await new Promise(resolve =>
				fetch(data.file.secure_url)
					.then(res => resolve(res.blob()))
					.catch(() => resolve(null)),
			);

			return {
				...data,
				file: {
					...data.file,
					download_url: blob === null ? '' : URL.createObjectURL(blob),
				},
			};
		};

		const handleGetSharedFile = async () => {
			setLoading(true);

			let url = `${import.meta.env.VITE_RESOURCE_URL}/api/public/${publicFileId}`;

			const options = {
				method: 'GET',
				signal,
				credentials: 'include',
			};

			const result = await handleFetch(url, options);

			const handleResult = async () => {
				result.success
					? setData(await getFileDownloadUrl(result.data))
					: setError(result);
				setLoading(false);
			};

			result && handleResult();
		};

		handleGetSharedFile();
		return () => controller.abort();
	}, [publicFileId]);

	return (
		<div className={styles['public-file']}>
			{error ? (
				<Error error={error.message}>
					<p>The file you are looking for could not be found.</p>
				</Error>
			) : (
				<>
					{loading ? (
						<Loading text="Loading..." />
					) : (
						<>
							<p>{data.file.name}</p>
							<div className={driveStyles.file}>
								<span
									className={`${icon} ${driveStyles['file-icon']} ${driveStyles[`${data.file.type}`]}`}
								/>
							</div>
							<div className={driveStyles['file-info']}>
								<p>Size: {formatBytes(data.file.size)}</p>
								<p>Shared by: {data.file.owner.username}</p>
								<p>Shared At: {format(data.createdAt, 'MMM d, y')}</p>
							</div>
							{data.file.download_url && (
								<a
									className={`${formStyles['form-submit']} ${driveStyles['file-link']}`}
									href={data.file.download_url}
									download={data.file.name}
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
