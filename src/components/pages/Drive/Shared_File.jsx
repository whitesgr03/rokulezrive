// Packages
import { useOutletContext, useParams } from 'react-router-dom';
import { format } from 'date-fns';

// Styles
import { icon } from '../../../styles/icon.module.css';
import driveStyles from './Drive.module.css';
import formStyles from '../../../styles/form.module.css';

import { formatBytes } from '../../../utils/format_bytes';

export const Shared_File = () => {
	const { shared } = useOutletContext();
	const { fileId } = useParams();

	const { file, sharedAt } = shared.find(item => item.file.id === fileId);

	return (
		<div className={driveStyles['file-info']}>
			<p>{file.name}</p>
			<div className={driveStyles.file}>
				<span
					className={`${icon} ${driveStyles['file-icon']} ${driveStyles[`${file.type}`]}`}
				/>
			</div>
			<div className={driveStyles['file-info']}>
				<p>Size: {formatBytes(file.size)}</p>
				<p>Shared by: {file.owner.username}</p>
				<p>Shared At: {format(sharedAt, 'MMM d, y')}</p>
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
