// Packages
import { useLocation } from 'react-router-dom';
import { format } from 'date-fns';

// Styles
import { icon } from '../../../styles/icon.module.css';
import uploadStyles from './Upload.module.css';
import formStyles from '../../../styles/form.module.css';
import styles from './File_info.module.css';

export const File_Into = () => {
	const {
		state: { file },
	} = useLocation();

	return (
		<div className={uploadStyles['file-info']}>
			<p>{file.name}</p>
			<div className={uploadStyles.file}>
				<span
					className={`${icon} ${uploadStyles['file-icon']} ${uploadStyles.image}`}
				/>
			</div>
			<div className={`${uploadStyles['file-info']} ${styles['file-wrap']}`}>
				{file.size && <p>File Size: {file.size}</p>}
				{file.owner && <p>Owner: {file.owner}</p>}
				<p className={styles.date}>
					Create At: {format(file.createdAt, 'MMM d, y')}
				</p>
			</div>
			<button type="button" className={formStyles['form-submit']}>
				Download
			</button>
		</div>
	);
};
