// Styles
import styles from './Loading.module.css';
import { icon } from '../../../styles/icon.module.css';

export const Loading = () => {
	return (
		<div className={styles.loading}>
			<span className={`${icon} ${styles.load}`} />
			Loading ...
		</div>
	);
};
