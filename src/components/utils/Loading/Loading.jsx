// Packages
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';

// Styles
import styles from './Loading.module.css';
import { icon } from '../../../styles/icon.module.css';

// Variables
const classes = classNames.bind(styles);

export const Loading = ({ text, dark, light }) => {
	return (
		<div
			className={`${styles.loading} ${classes({
				dark,
				light,
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
};
