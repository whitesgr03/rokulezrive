// Packages
import { useOutletContext, useParams } from 'react-router-dom';
import { format } from 'date-fns';

// Styles
import { icon } from '../../../styles/icon.module.css';
import driveStyles from './Drive.module.css';
import formStyles from '../../../styles/form.module.css';

export const File_Into = () => {
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
			<div
				className={`${driveStyles['file-info']} ${driveStyles['file-wrap']}`}
			>
				{file.size && <p>File Size: {file.size}</p>}
				{file.owner && <p>Owner: {file.owner}</p>}
				<p>Create At: {format(file.createdAt, 'MMM d, y')}</p>
			</div>
			<button type="button" className={formStyles['form-submit']}>
				Download
			</button>
		</div>
	);
};
