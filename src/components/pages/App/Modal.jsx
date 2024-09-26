// Packages
import PropTypes from 'prop-types';

// Styles
import styles from './Modal.module.css';
import { icon } from '../../../styles/icon.module.css';

export const Modal = ({ onCloseModal, clickToClose, children }) => {
	return (
		<div className={styles.modal} onClick={onCloseModal}>
			<div className={styles['modal-wrap']}>
				{clickToClose && (
					<button className={styles['modal-button']} data-close-modal>
						<span className={`${icon} ${styles.close}`} />
					</button>
				)}
				<div className={styles.container}>{children}</div>
			</div>
		</div>
	);
};

Modal.propTypes = {
	onCloseModal: PropTypes.func,
	clickToClose: PropTypes.bool,
	children: PropTypes.node,
};
