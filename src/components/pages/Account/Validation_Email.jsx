// Styles
import styles from './Validation_Email.module.css';
import PropTypes from 'prop-types';

export const ValidationEmail = ({ children }) => {
	return (
		<div className={styles.container}>
			<h3>Verify your Account</h3>
			{children}
			<p>You can now close this page.</p>
		</div>
	);
};

ValidationEmail.propTypes = {
	children: PropTypes.node,
};
