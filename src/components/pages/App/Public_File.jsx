// Packages
import { useParams, useLocation, Navigate } from 'react-router-dom';
import { format } from 'date-fns';
import { useState, useEffect } from 'react';
import { useMediaQuery } from 'react-responsive';

// Styles
import { icon } from '../../../styles/icon.module.css';
import formStyles from '../../../styles/form.module.css';
import driveStyles from '../Drive/Drive.module.css';
import styles from './Public_File.module.css';

// Components
import { Loading } from '../../utils/Loading/Loading';
import { Footer } from '../../layout/Footer/Footer';

// Utils
import { formatBytes } from '../../../utils/format_bytes';
import { handleFetch, handleFetchBlob } from '../../../utils/handle_fetch';
import { createDownloadElement } from '../../../utils/create_download_element';

// Variables
const downloadingIcon = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1em' height='1em' viewBox='0 0 24 24'%3E%3Cg fill='none' stroke='%23000' stroke-linecap='round' stroke-linejoin='round' stroke-width='2'%3E%3Cpath stroke-dasharray='2 4' stroke-dashoffset='6' d='M12 3c4.97 0 9 4.03 9 9c0 4.97 -4.03 9 -9 9'%3E%3Canimate attributeName='stroke-dashoffset' dur='0.6s' repeatCount='indefinite' values='6;0'/%3E%3C/path%3E%3Cpath stroke-dasharray='32' stroke-dashoffset='32' d='M12 21c-4.97 0 -9 -4.03 -9 -9c0 -4.97 4.03 -9 9 -9'%3E%3Canimate fill='freeze' attributeName='stroke-dashoffset' begin='0.1s' dur='0.4s' values='32;0'/%3E%3C/path%3E%3Cpath stroke-dasharray='10' stroke-dashoffset='10' d='M12 8v7.5'%3E%3Canimate fill='freeze' attributeName='stroke-dashoffset' begin='0.5s' dur='0.2s' values='10;0'/%3E%3C/path%3E%3Cpath stroke-dasharray='6' stroke-dashoffset='6' d='M12 15.5l3.5 -3.5M12 15.5l-3.5 -3.5'%3E%3Canimate fill='freeze' attributeName='stroke-dashoffset' begin='0.7s' dur='0.2s' values='6;0'/%3E%3C/path%3E%3C/g%3E%3C/svg%3E#123`;

export const PublicFile = () => {
	const { publicFileId } = useParams();

	const [file, setFile] = useState({});
	const [loading, setLoading] = useState(true);
	const [downloading, setDownloading] = useState(false);
	const [error, setError] = useState(null);

	const { pathname: previousPath } = useLocation();
	const isNormalTablet = useMediaQuery({ minWidth: 700 });

	const handleGetResourceUrl = async () => {
		setDownloading(true);

		const url = `${import.meta.env.VITE_RESOURCE_URL}/api/public/${publicFileId}/download-url`;

		const options = {
			method: 'GET',
		};

		const handleDownload = async url => {
			const result = await handleFetchBlob(url);

			result.success
				? createDownloadElement(result.blob, file.name).click()
				: setError('File resource url cloud not be loaded.');
		};

		const result = await handleFetch(url, options);

		result.success
			? await handleDownload(result.data.url)
			: setError(result.message);

		setDownloading(false);
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
				result.success
					? setFile(result.data)
					: setError('The file you are looking for could not be found.');
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
				<Navigate
					to="/error"
					state={{ error, previousPath, customMessage: true }}
				/>
			) : (
				<>
					<div className={driveStyles['file-container']}>
						{loading ? (
							<Loading text="Loading..." />
						) : (
							<>
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
									<p>Shared by: {file.owner.email}</p>
									<p>Shared At: {format(file.sharedAt, 'MMM d, y')}</p>
								</div>
								<button
									className={`${formStyles['form-submit']} ${driveStyles['download-btn']}`}
									onClick={() => !downloading && handleGetResourceUrl()}
								>
									<span className={`${driveStyles['download-text']}`}>
										Download
										{downloading && (
											<span
												style={{
													maskImage: `url("${downloadingIcon}#${Math.random()}")`,
												}}
												className={`${icon} ${driveStyles['downloading']} ${driveStyles['download-icon']}`}
											></span>
										)}
									</span>
								</button>
							</>
						)}
					</div>
					{isNormalTablet && <Footer />}
				</>
			)}
		</div>
	);
};
