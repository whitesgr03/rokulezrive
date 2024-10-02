// Packages
import { useLocation } from 'react-router-dom';
import { format } from 'date-fns';

// Styles
import { icon } from '../../../../../styles/icon.module.css';
import driveStyles from '../../Drive.module.css';
import formStyles from '../../../../../styles/form.module.css';

import { formatBytes } from '../../../../../utils/format_bytes';

export const File_Into = () => {
	const { state } = useLocation();

	const { file, shared_createdAt } = state;

	return (
		<div className={driveStyles['file-info']}>
			<p>{file.name}</p>
			<div className={driveStyles.file}>
				<span
					className={`${icon} ${driveStyles['file-icon']} ${driveStyles.image}`}
				/>
			</div>
			<div className={driveStyles['file-info']}>
				{file.size && <p>File Size: {formatBytes(file.size)}</p>}
				{file.owner && <p>Owner: {file.owner}</p>}
				<p>Create At: {format(file.createdAt, 'MMM d, y')}</p>
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
		</div>
	);
};