// Packages
import PropTypes from 'prop-types';

// Styles
import styles from './Modal.module.css';
import { icon } from '../../../styles/icon.module.css';

export const Modal = ({ onActiveModal, clickToClose, children }) => {
	return (
		<div
			className={styles.modal}
			onClick={e => {
				e.target === e.currentTarget && onActiveModal({ component: null });
			}}
			data-testid="modal"
		>
			<div className={styles['modal-wrap']}>
				{clickToClose && (
					<button
						className={styles['modal-button']}
						title="close-button"
						onClick={e =>
							e.target === e.currentTarget && onActiveModal({ component: null })
						}
					>
						<span className={`${icon} ${styles.close}`} />
					</button>
				)}
				<div className={styles.container}>{children}</div>
			</div>
		</div>
	);
};

Modal.propTypes = {
	onActiveModal: PropTypes.func,
	clickToClose: PropTypes.bool,
	children: PropTypes.node,
};
