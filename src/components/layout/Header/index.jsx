// Packages
import { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { useMediaQuery } from 'react-responsive';
import classNames from 'classnames/bind';

// Styles
import styles from './Header.module.css';
import { icon } from '../../../styles/icon.module.css';

// Utils
import { handleFetch } from '../../../utils/handleFetch';

// Assets
import logo from '../../../assets/logo.png';

// Variables
const classes = classNames.bind(styles);
const URL = `${import.meta.env.VITE_RESOURCE_URL}/account/logout`;

export const Header = ({
	user,
	darkTheme,
	onSwitchColorTheme,
	menu,
	onUser,
	onActiveMenu,
}) => {
	const [dropdownSlideOut, setDropdownSlideOut] = useState(false);
	const [error, setError] = useState(false);

	const isSmallMobile = useMediaQuery({ maxWidth: 450 });

	const handleDropdownSlideOut = () => {
		onActiveMenu({
			button: 'account-button',
			name: 'dropdown',
		});
		setDropdownSlideOut(true);
	};

	const handleLogout = async () => {
		const options = {
			method: 'GET',
			credentials: 'include',
		};
		const result = await handleFetch(URL, options);

		result.success && onUser(null);
		result.success && localStorage.removeItem('drive.session-exp');
		!result.success && setError(result.message);
	};

	return (
		<>
			{error ? (
				<Navigate to="/error" state={{ error }} />
			) : (
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
								className={`${styles['feature-button']}`}
								onClick={handleDropdownSlideOut}
								data-button="account-button"
							>
								<span className={`${icon} ${styles.user}`} />
							</button>
						</li>
					</ul>
					<ul
						className={`dropdown ${styles.dropdown} ${classes({
							'dropdown-slide-in': menu.name === 'dropdown',
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
								<button
									className={styles['dropdown-link']}
									onClick={handleLogout}
									data-close-menu
								>
									<span className={`${icon} ${styles.logout}`} />
									Logout
								</button>
							) : (
								<Link
									to="/account/login"
									className={`login ${styles['dropdown-link']}`}
									data-close-menu
								>
									<span className={`${icon} ${styles.login}`} />
									Login
								</Link>
							)}
						</li>
					</ul>
				</header>
			)}
		</>
	);
};

Header.propTypes = {
	user: PropTypes.object,
	darkTheme: PropTypes.bool,
	onSwitchColorTheme: PropTypes.func,
	menu: PropTypes.object,
	onActiveMenu: PropTypes.func,
	onUser: PropTypes.func,
};
