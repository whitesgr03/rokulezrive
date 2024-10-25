import { useOutletContext, Navigate } from 'react-router-dom';
import PropTypes from 'prop-types';

export const Authentication = ({ isPublicRoute = false, children }) => {
	const { session } = useOutletContext();

	return isPublicRoute ? (
		session ? (
			<Navigate to="/drive" replace={true} />
		) : (
			children
		)
	) : session ? (
		children
	) : (
		<Navigate to="/" replace={true} />
	);
};

Authentication.propTypes = {
	isPublicRoute: PropTypes.bool,
	children: PropTypes.node.isRequired,
};
