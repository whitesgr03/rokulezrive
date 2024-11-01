// Packages
import { Link, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';

// Styles
import styles from './Error.module.css';
import { icon } from '../../../styles/icon.module.css';

export const Error = ({ error }) => {
	const { state } = useLocation();

	const message = state?.error || error;
	console.error('Error component:', message);

	const handleClick = () => {
		document.body.removeAttribute('style');
	};

	return (
		<div className={styles.container}>
			<div className={styles.error}>
				<span className={`${icon} ${styles.alert}`} />
				<div className={styles.message}>
					<p>Our apologies, there has been an error.</p>
					{state.publicRoute ? (
						<p>{state.error}</p>
					) : (
						<p>
							Please come back later, or if you have any questions, contact us.
						</p>
					)}
				</div>

				{state.previousPath && (
					<Link
						to={state.previousPath}
						className={styles.link}
						onClick={handleClick}
					>
						Go Back
					</Link>
				)}
				<Link to="/drive" className={styles.link} onClick={handleClick}>
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
