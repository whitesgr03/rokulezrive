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
	const [downloading, setDownloading] = useState(false);
	const [error, setError] = useState(null);

	const downloadingIcon = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1em' height='1em' viewBox='0 0 24 24'%3E%3Cg fill='none' stroke='%23000' stroke-linecap='round' stroke-linejoin='round' stroke-width='2'%3E%3Cpath stroke-dasharray='2 4' stroke-dashoffset='6' d='M12 3c4.97 0 9 4.03 9 9c0 4.97 -4.03 9 -9 9'%3E%3Canimate attributeName='stroke-dashoffset' dur='0.6s' repeatCount='indefinite' values='6;0'/%3E%3C/path%3E%3Cpath stroke-dasharray='32' stroke-dashoffset='32' d='M12 21c-4.97 0 -9 -4.03 -9 -9c0 -4.97 4.03 -9 9 -9'%3E%3Canimate fill='freeze' attributeName='stroke-dashoffset' begin='0.1s' dur='0.4s' values='32;0'/%3E%3C/path%3E%3Cpath stroke-dasharray='10' stroke-dashoffset='10' d='M12 8v7.5'%3E%3Canimate fill='freeze' attributeName='stroke-dashoffset' begin='0.5s' dur='0.2s' values='10;0'/%3E%3C/path%3E%3Cpath stroke-dasharray='6' stroke-dashoffset='6' d='M12 15.5l3.5 -3.5M12 15.5l-3.5 -3.5'%3E%3Canimate fill='freeze' attributeName='stroke-dashoffset' begin='0.7s' dur='0.2s' values='6;0'/%3E%3C/path%3E%3C/g%3E%3C/svg%3E#123#${Math.random()}")`;

	const handleGetResourceUrl = async ({ id, name }) => {
		const deleteResource = async data => {
			const url = `https://api.cloudinary.com/v1_1/${data.cloud_name}/delete_by_token`;

			const options = {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					token: data.delete_token,
				}),
			};

			const { result } = await handleFetch(url, options);
			result !== 'ok' && setError('Fail to delete resource');
		};

		const createDownloadUrl = async url => {
			const blob = await new Promise(resolve =>
				fetch(url, { cache: 'no-cache' })
					.then(res => resolve(res.blob()))
					.catch(() => resolve(null)),
			);

			const handleDownload = downloadUrl => {
				const a = document.createElement('a');
				a.href = downloadUrl;
				a.download = name;
				a.click();
			};

			!blob?.size
				? setError('File resource url cloud not be loaded')
				: handleDownload(URL.createObjectURL(blob));
		};

		const createResourceUrl = async () => {
			setDownloading(true);
			const url = `${import.meta.env.VITE_RESOURCE_URL}/api/files/${id}/copy`;

			const options = {
				method: 'POST',
				headers: {
					'X-Requested-With': 'XmlHttpRequest',
				},
				credentials: 'include',
			};

			const result = await handleFetch(url, options);

			const handleSuccess = async () => {
				const { secure_url, ...data } = result.data;
				await createDownloadUrl(secure_url);
				setDownloading(false);
				await deleteResource(data);
			};

			result.success ? handleSuccess() : setError(result.message);
		};

		!downloading && createResourceUrl();
	};

	useEffect(() => {
		const controller = new AbortController();
		const { signal } = controller;

		const handleGetSharedFile = async () => {
			let url = `${import.meta.env.VITE_RESOURCE_URL}/api/public/${publicFileId}`;

			const options = {
				method: 'GET',
				signal,
			};

			const result = await handleFetch(url, options);

			const handleResult = async () => {
				result.success ? setData(result.data) : setError(result);
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
				<Error error={error.message} onError={setError}>
					<p>The file you are looking for could not be found.</p>
				</Error>
			) : (
				<>
					{loading ? (
						<Loading text="Loading..." />
					) : (
						<>
							<p>{data.file.name}</p>
							<div>
								<span
									className={`${icon} ${driveStyles['file-icon']} ${driveStyles[`${data.file.type}`]}`}
								/>
							</div>
							<div className={driveStyles['file-info']}>
								<p>Size: {formatBytes(data.file.size)}</p>
								<p>Shared by: {data.file.owner.email}</p>
								<p>Shared At: {format(data.createdAt, 'MMM d, y')}</p>
							</div>
							<button
								className={`${formStyles['form-submit']} ${driveStyles['download-btn']}`}
								onClick={() =>
									handleGetResourceUrl({
										id: data.file.id,
										name: data.file.name,
									})
								}
							>
								<span className={`${driveStyles['download-text']}`}>
									Download
									{downloading && (
										<span
											style={{
												maskImage: downloadingIcon,
											}}
											className={`${icon} ${driveStyles['downloading']} ${driveStyles['download-icon']}`}
										></span>
									)}
								</span>
							</button>
						</>
					)}
				</>
			)}
		</div>
	);
};
