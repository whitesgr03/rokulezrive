import { Link } from 'react-router-dom';

// Styles
import style from './Error.module.css';
import { icon } from '../../../styles/icon.module.css';

export const NotFound = () => {
	return (
		<div className={style.error}>
			<span className={`${icon} ${style.alert}`} />
			<h2>404 Page Not Found</h2>
			<div className={style.message}>
				<p>The page you are looking for could not be found.</p>
				<p>You may surf over to our other pages.</p>
			</div>
			<Link to="/" className={style.link}>
				Back to Home Page
			</Link>
		</div>
	);
};
