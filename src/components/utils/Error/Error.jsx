// Packages
import { Link, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

// Styles
import styles from './Error.module.css';
import { icon } from '../../../styles/icon.module.css';

export const Error = ({ error, children }) => {
	const [darkTheme, setDarkTheme] = useState(false);
	const { state } = useLocation();

	console.error('Error component:', state ? state.error : error);

	useEffect(() => {
		const getColorTheme = () => {
			const darkScheme = localStorage.getItem('darkTheme');

			const browserDarkScheme =
				window.matchMedia('(prefers-color-scheme: dark)')?.matches ?? false;

			darkScheme === null &&
				localStorage.setItem('darkTheme', browserDarkScheme);

			setDarkTheme(
				darkScheme === null ? browserDarkScheme : darkScheme === 'true',
			);
		};
		!children && getColorTheme();
	}, [children]);

	return (
		<div className={`${styles.container} ${darkTheme ? 'dark' : ''}`}>
			<div className={styles.error}>
				<span className={`${icon} ${styles.alert}`} />
				<div className={styles.message}>
					<p>Our apologies, there has been an error.</p>
					{children ? (
						children
					) : (
						<p>
							Please come back later, or if you have any questions, contact us.
						</p>
					)}
				</div>
				<Link to="/" className={styles.link}>
					Back to Home Page
				</Link>
			</div>
		</div>
	);
};

Error.propTypes = {
	error: PropTypes.string,
	children: PropTypes.node,
};
