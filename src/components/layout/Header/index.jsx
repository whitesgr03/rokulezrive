// Packages
import { useState } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { useMediaQuery } from 'react-responsive';
import classNames from 'classnames/bind';

// Styles
import styles from './Header.module.css';
import { icon } from '../../../styles/icon.module.css';

// Assets
import logo from '../../../assets/logo.png';

// Variables
const classes = classNames.bind(styles);

export const Header = ({
	user,
	darkTheme,
	activeDropdown,
	onSwitchColorTheme,
}) => {
	const [dropdownSlideOut, setDropdownSlideOut] = useState(false);

	const isSmallMobile = useMediaQuery({ maxWidth: 450 });

	const handleDropdownSlideOut = () => setDropdownSlideOut(true);

	return (
		<header className={styles.header}>
			<Link to="/" className={styles.logo}>
				<img src={logo} alt="Logo" className={styles['logo-image']} />
			</Link>
			<ul className={styles.features}>
				{!isSmallMobile && (
					<li className={styles['feature-item']}>
						<button
							type="button"
							className={styles['feature-button']}
							onClick={onSwitchColorTheme}
						>
							<div className={styles.toggle}>
								<span
									className={`${icon} ${darkTheme ? styles.moon : styles.sun}`}
								/>
								<div className={styles['toggle-background']}>
									<div className={styles['toggle-button']} />
								</div>
							</div>
						</button>
					</li>
				)}
				<li className={styles['feature-item']}>
					<button
						type="button"
						className={`account-button ${styles['feature-button']}`}
						onClick={handleDropdownSlideOut}
					>
						<span className={`${icon} ${styles.user}`} />
					</button>
				</li>
			</ul>
			<ul
				className={`dropdown ${styles.dropdown} ${classes({
					'dropdown-slide-in': activeDropdown,
					'dropdown-slide-out': dropdownSlideOut,
				})}`}
			>
				{isSmallMobile && (
					<li>
						<button
							type="button"
							className={styles['dropdown-button']}
							onClick={onSwitchColorTheme}
						>
							<span className={icon} />
							<span>{darkTheme ? 'Dark ' : 'Light '}mode</span>
							<div className={styles.toggle}>
								<div className={styles['toggle-background']}>
									<div className={styles['toggle-button']} />
								</div>
							</div>
						</button>
					</li>
				)}
				<li>
					{user ? (
						<button className={styles['dropdown-link']}>
							<span className={`${icon} ${styles.logout}`} />
							Logout
						</button>
					) : (
						<Link
							to="/account/login"
							className={styles['dropdown-link']}
							data-close
						>
							<span className={`${icon} ${styles.login}`} />
							Login
						</Link>
					)}
				</li>
			</ul>
		</header>
	);
};

Header.propTypes = {
	user: PropTypes.object,
	darkTheme: PropTypes.bool,
	activeDropdown: PropTypes.bool,
	onSwitchColorTheme: PropTypes.func,
};
