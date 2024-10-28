// Packages
import { useState } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { useMediaQuery } from 'react-responsive';
import classNames from 'classnames/bind';
import { supabase } from '../../../utils/supabase_client';
import { handleFetch } from '../../../utils/handle_fetch';

// Styles
import styles from './Header.module.css';
import { icon } from '../../../styles/icon.module.css';

// Assets
import logo from '../../../assets/logo.png';

// Variables
const classes = classNames.bind(styles);

export const Header = ({
	darkTheme,
	onSwitchColorTheme,
	menu,
	onActiveMenu,
	userId,
	onUserId,
}) => {
	const [dropdownSlideOut, setDropdownSlideOut] = useState(false);

	const isNormalMobile = useMediaQuery({ minWidth: 440 });
	const isNormalTablet = useMediaQuery({ minWidth: 700 });

	const handleDropdownSlideOut = () => {
		onActiveMenu({
			button: 'account-button',
			name: 'dropdown',
		});
		setDropdownSlideOut(true);
	};

	const handleLogout = async () => {
		onUserId(null);

		await supabase.auth.signOut();
	};

	return (
		<header className={styles.header}>
			<Link to={userId ? '/drive' : '/'} className={styles.logo}>
				<img src={logo} alt="Logo" className={styles['logo-image']} />
				{isNormalTablet && <h1 className={styles['logo-text']}>Local Drive</h1>}
			</Link>
			<ul className={styles.features}>
				{isNormalMobile && (
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
				{!isNormalMobile && (
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
					{userId ? (
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
	);
};

Header.propTypes = {
	darkTheme: PropTypes.bool,
	onSwitchColorTheme: PropTypes.func,
	menu: PropTypes.object,
	onActiveMenu: PropTypes.func,
	onUserId: PropTypes.func,
	userId: PropTypes.string,
};
