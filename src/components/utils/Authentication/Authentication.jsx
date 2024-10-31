// Packages
import { useOutletContext, Navigate } from 'react-router-dom';
import PropTypes from 'prop-types';

export const Authentication = ({ children }) => {
	const { userId } = useOutletContext();

	return userId ? children : <Navigate to="/" replace={true} />;
};

Authentication.propTypes = {
	isPublicRoute: PropTypes.bool,
	children: PropTypes.node.isRequired,
};
