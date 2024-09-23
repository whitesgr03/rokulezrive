import { useOutletContext, Navigate } from 'react-router-dom';
import PropTypes from 'prop-types';

export const Authentication = ({ children }) => {
	const { user } = useOutletContext();

	return user ? children : <Navigate to="/" replace={true} />;
};

Authentication.propTypes = {
	children: PropTypes.node.isRequired,
};
