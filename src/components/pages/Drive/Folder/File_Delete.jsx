// Styles
import styles from './File_Delete.module.css';


export const File_Delete = ({ name }) => {
	return (
		<div className={styles['file-delete']}>
			<h3>Delete Forever</h3>
			<div className={styles.container}>
				<p>Do you really want to delete?</p>
				<p>{`"${name}"`}</p>
				<div className={styles['file-button-wrap']}>
					<button
						className={`${styles['file-button']} ${styles.cancel}`}
						data-close-modal
					>
						Cancel
					</button>
					<button className={`${styles['file-button']} ${styles.delete}`}>
						Delete
					</button>
				</div>
			</div>
		</div>
	);
};
