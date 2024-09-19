// Packages
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

// Styles
import style from './Error.module.css';
import { icon } from '../../../styles/icon.module.css';

export const Error = ({ error }) => {
	console.error('Error component:', error);

	return (
		<div className={style.error}>
			<span className={`${icon} ${style.alert}`} />
			<div className={style.message}>
				<p>Our apologies, there has been an error.</p>
				<p>Please come back later, or if you have any questions, contact us.</p>
			</div>
			<Link to="/" className={style.link}>
				Back to Home Page
			</Link>
		</div>
	);
};

Error.propTypes = {
	error: PropTypes.string,
};
