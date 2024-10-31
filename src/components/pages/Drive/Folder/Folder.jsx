// Packages
import { useOutletContext } from 'react-router-dom';

// Styles
import styles from './Folder.module.css';

// Components
import { Subfolders } from './Subfolder/Subfolders';
import { Files } from './File/Files';

export const Folder = () => {
	const { folder } = useOutletContext();

	return (
		<>
			{!folder.subfolders.length && !folder.files.length ? (
				<p className={styles.text}>No files in the folder</p>
			) : (
				<>
					{folder.subfolders.length > 0 && <Subfolders />}
					{folder.files.length > 0 && <Files />}
				</>
			)}
		</>
	);
};
