// Packages
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';

// Styles
import styles from './Loading.module.css';
import { icon } from '../../../styles/icon.module.css';

// Variables
const classes = classNames.bind(styles);

export const Loading = ({ text, dark, light, shadow }) => {
	return (
		<div
			className={`${styles.loading} ${classes({
				dark,
				light,
				shadow,
			})}`}
		>
			<span className={`${icon} ${styles.load}`} />
			{text}
		</div>
	);
};

Loading.propTypes = {
	text: PropTypes.string,
	dark: PropTypes.bool,
	light: PropTypes.bool,
	shadow: PropTypes.bool,
};
