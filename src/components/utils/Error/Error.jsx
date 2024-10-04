// Packages
import { Link, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';

// Styles
import styles from './Error.module.css';
import { icon } from '../../../styles/icon.module.css';

export const Error = ({ error }) => {
	const { state } = useLocation();
	console.error('Error component:', state ? state.error : error);

	return (
			<div className={styles.error}>
				<span className={`${icon} ${styles.alert}`} />
				<div className={styles.message}>
					<p>Our apologies, there has been an error.</p>
						<p>
							Please come back later, or if you have any questions, contact us.
						</p>
				<Link to="/" className={styles.link}>
					Back to Home Page
				</Link>
			</div>
		</div>
	);
};

Error.propTypes = {
	error: PropTypes.string,
};
