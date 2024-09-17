// Packages
import PropTypes from 'prop-types';

// Styles
import styles from './Modal.module.css';
import { icon } from '../../../styles/icon.module.css';

export const Modal = ({ onCloseModal, children }) => {
	return (
		<div className={styles.modal} onClick={onCloseModal} data-close-modal>
			<div className={styles['modal-wrap']}>
				<button className={styles['modal-button']} data-close-modal>
					<span className={`${icon} ${styles.close}`} />
				</button>
				<div className={styles.container}>{children}</div>
			</div>
		</div>
	);
};

Modal.propTypes = {
	onCloseModal: PropTypes.func,
	children: PropTypes.node,
};
