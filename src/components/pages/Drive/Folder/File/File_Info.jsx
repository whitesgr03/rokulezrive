// Packages
import { useOutletContext, useParams } from 'react-router-dom';
import { format } from 'date-fns';

// Styles
import { icon } from '../../../../../styles/icon.module.css';
import driveStyles from '../../Drive.module.css';
import formStyles from '../../../../../styles/form.module.css';

import { formatBytes } from '../../../../../utils/format_bytes';

export const File_Info = () => {
	const { folder } = useOutletContext();
	const { fileId } = useParams();

	const file = folder.files.find(file => file.id === fileId);

	return (
		<div className={driveStyles['file-info']}>
			<p>{file.name}</p>
			<div className={driveStyles.file}>
				<span
					className={`${icon} ${driveStyles['file-icon']} ${driveStyles.image}`}
				/>
			</div>
			<div className={driveStyles['file-info']}>
				{file.owner && <p>Owner: {file.owner.username}</p>}
				{file.size && <p>Size: {formatBytes(file.size)}</p>}
				{file.owner ? (
					<p>Shared At: {format(shared_createdAt, 'MMM d, y')}</p>
				) : (
					<p>Create At: {format(file.createdAt, 'MMM d, y')}</p>
				)}
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
