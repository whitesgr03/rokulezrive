// Packages
import PropTypes from 'prop-types';

// Styles
import styles from './Modal.module.css';
import { icon } from '../../../styles/icon.module.css';

export const Modal = ({ onCloseModel, children }) => {
	return (
		<div className={styles.modal} onClick={onCloseModel} data-close-model>
			<div className={styles['modal-wrap']}>
				<button className={styles['modal-button']} data-close-model>
					<span className={`${icon} ${styles.close}`} />
				</button>
				<div className={styles.container}>{children}</div>
			</div>
		</div>
	);
};

Modal.propTypes = {
	onCloseModel: PropTypes.func,
	children: PropTypes.node,
};
