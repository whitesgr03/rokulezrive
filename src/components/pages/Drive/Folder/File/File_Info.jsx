// Packages
import { useOutletContext, useParams, Navigate } from 'react-router-dom';
import { format } from 'date-fns';
import { useState } from 'react';

// Styles
import { icon } from '../../../../../styles/icon.module.css';
import formStyles from '../../../../../styles/form.module.css';
import driveStyles from '../../Drive.module.css';

import { formatBytes } from '../../../../../utils/format_bytes';

const downloadingIcon = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1em' height='1em' viewBox='0 0 24 24'%3E%3Cg fill='none' stroke='%23000' stroke-linecap='round' stroke-linejoin='round' stroke-width='2'%3E%3Cpath stroke-dasharray='2 4' stroke-dashoffset='6' d='M12 3c4.97 0 9 4.03 9 9c0 4.97 -4.03 9 -9 9'%3E%3Canimate attributeName='stroke-dashoffset' dur='0.6s' repeatCount='indefinite' values='6;0'/%3E%3C/path%3E%3Cpath stroke-dasharray='32' stroke-dashoffset='32' d='M12 21c-4.97 0 -9 -4.03 -9 -9c0 -4.97 4.03 -9 9 -9'%3E%3Canimate fill='freeze' attributeName='stroke-dashoffset' begin='0.1s' dur='0.4s' values='32;0'/%3E%3C/path%3E%3Cpath stroke-dasharray='10' stroke-dashoffset='10' d='M12 8v7.5'%3E%3Canimate fill='freeze' attributeName='stroke-dashoffset' begin='0.5s' dur='0.2s' values='10;0'/%3E%3C/path%3E%3Cpath stroke-dasharray='6' stroke-dashoffset='6' d='M12 15.5l3.5 -3.5M12 15.5l-3.5 -3.5'%3E%3Canimate fill='freeze' attributeName='stroke-dashoffset' begin='0.7s' dur='0.2s' values='6;0'/%3E%3C/path%3E%3C/g%3E%3C/svg%3E#123`;
const RESOURCE_URL =
	import.meta.env.MODE === 'production'
		? import.meta.env.VITE_RESOURCE_URL
		: import.meta.env.VITE_LOCAL_RESOURCE_URL;

export const File_Info = () => {
	const { folder } = useOutletContext();
	const { fileId } = useParams();
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);
	const [downloading, setDownloading] = useState(`url("${downloadingIcon}")`);

	const file = folder.files.find(file => file.id === fileId);

	const handleDownload = async () => {
		setLoading(true);
		const blob = await new Promise(resolve =>
			fetch(file.url)
				.then(res => resolve(res.blob()))
				.catch(() => resolve(null)),
		);

		const download = () => {
			const a = document.createElement('a');
			a.href = URL.createObjectURL(blob);
			a.download = file.name;
			a.click();
		};

		!blob?.size
			? setError('File resource url cloud not be loaded')
			: download();

		setLoading(false);
		setDownloading(`url("${downloadingIcon}#${Math.random()}")`);
	};

	return (
		<>
			{error ? (
				<Navigate to="/error" state={{ error }} />
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
						onClick={handleDownload}
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
