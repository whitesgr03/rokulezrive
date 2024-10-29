// Packages
import { useParams } from 'react-router-dom';
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
import { Error } from '../../utils/Error/Error';
import { Footer } from '../../layout/Footer/Footer';

// Utils
import { formatBytes } from '../../../utils/format_bytes';
import { handleFetch } from '../../../utils/handle_fetch';

export const Public_File = () => {
	const { publicFileId } = useParams();
	const [file, setFile] = useState({});
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	const isNormalTablet = useMediaQuery({ minWidth: 700 });
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

			const handleGetDownloadUrl = async file => {
				const blob = await new Promise(resolve =>
					fetch(file.url)
						.then(res => resolve(res.blob()))
						.catch(() => resolve(null)),
				);

				return !blob
					? setError('File resource url cloud not be loaded')
					: {
							...file,
							url: URL.createObjectURL(blob),
						};
			};

			const handleResult = async () => {
				result.success
					? setFile(await handleGetDownloadUrl(result.data))
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
				<Error error={error.message} onError={setError}>
					<p>The file you are looking for could not be found.</p>
				</Error>
			) : (
				<>
					{loading ? (
						<Loading text="Loading..." />
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
								<p>Shared by: {file.owner.email}</p>
								<p>Shared At: {format(file.sharedAt, 'MMM d, y')}</p>
							</div>
							<a
								download={file.name}
								href={file.url}
								className={`${formStyles['form-submit']} ${driveStyles['download-btn']}`}
							>
								Download
							</a>
						</div>
					)}
				</>
			)}
			{isNormalTablet && <Footer />}
		</div>
	);
};
