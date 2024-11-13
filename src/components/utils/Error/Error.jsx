// Packages
import { Link, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';

// Styles
import styles from './Error.module.css';
import { icon } from '../../../styles/icon.module.css';

export const Error = () => {
	const { state } = useLocation();

	return (
		<div className={styles.container}>
			<div className={styles.error}>
				<span className={`${icon} ${styles.alert}`} />
				<div className={styles.message}>
					<p>Our apologies, there has been an error.</p>
					{state?.customMessage ? (
						<p>{state?.error}</p>
					) : (
						<p>
							Please come back later, or if you have any questions, contact us.
						</p>
					)}
				</div>

				{state?.previousPath && (
					<Link to={state.previousPath} className={styles.link}>
						Go Back
					</Link>
				)}
				<Link to="/drive" className={styles.link}>
					Back to Home Page
				</Link>
			</div>
		</div>
	);
};

Error.propTypes = {
	error: PropTypes.string,
	children: PropTypes.node,
	onError: PropTypes.func,
};
