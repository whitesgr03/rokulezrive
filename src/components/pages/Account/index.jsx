// Packages
import { useOutletContext, Navigate } from 'react-router-dom';
import PropTypes from 'prop-types';

// Styles
import styles from './Account.module.css';

export const Account = ({ title, children }) => {
	const { user } = useOutletContext();

	return (
		<>
			{user ? (
				<Navigate to="/drive" replace={true} />
			) : (
				<div className={styles.account}>
					<h3>{title}</h3>
					<div className={styles.container}>{children}</div>
				</div>
			)}
		</>
	);
};

Account.propTypes = {
	title: PropTypes.string,
	children: PropTypes.node,
};
