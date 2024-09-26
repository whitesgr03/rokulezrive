import { useOutletContext } from 'react-router-dom';

// Styles
import styles from './Folder.module.css';

// Components
import { Subfolders } from './Subfolders';
import { Files } from './Files';

export const Folder = () => {
	const { data, menu, onActiveMenu, onActiveModal } = useOutletContext();

	return (
		<>
			{!data.subfolders.length && !data.files.length ? (
				<p className={styles.text}>No files in the folder</p>
			) : (
				<>
					{data.subfolders.length > 0 && (
						<Subfolders
							data={data.subfolders}
							menu={menu}
							onActiveMenu={onActiveMenu}
							onActiveModal={onActiveModal}
						/>
					)}
					{data.files.length > 0 && (
						<Files
							data={data.files}
							menu={menu}
							onActiveMenu={onActiveMenu}
							onActiveModal={onActiveModal}
						/>
					)}
				</>
			)}
		</>
	);
};
