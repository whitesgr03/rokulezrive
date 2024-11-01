// Packages
import { useOutletContext, Navigate } from 'react-router-dom';
import PropTypes from 'prop-types';

// Styles
import styles from './Account.module.css';

// Components
import { Loading } from '../../utils/Loading/Loading';

export const Account = ({ title, loading, children }) => {
	const { userId } = useOutletContext();

	return (
		<>
			{userId ? (
				<Navigate to="/drive" replace={true} />
			) : (
				<div className={styles.account}>
					<h3>{title}</h3>
					<div className={styles.container}>
						{loading && (
							<Loading text={'Submitting...'} light={true} shadow={true} />
						)}
						{children}
					</div>
				</div>
			)}
		</>
	);
};

Account.propTypes = {
	title: PropTypes.string,
	loading: PropTypes.bool,
	children: PropTypes.node,
};
