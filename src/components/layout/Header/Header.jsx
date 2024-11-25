// Packages
import { useState } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { useMediaQuery } from 'react-responsive';
import classNames from 'classnames/bind';
import { supabase } from '../../../utils/supabase_client';

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
	dropdownSlideIn,
	onActiveMenu,
	isLogin,
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
		const {
			data: { session },
		} = await supabase.auth.getSession();

		session.user.user_metadata.login &&
			(await supabase.auth.updateUser({
				data: { login: false },
			}));

		await supabase.auth.signOut();
	};

	return (
		<header className={styles.header}>
			<Link to={isLogin ? '/drive' : '/'} className={styles.logo}>
				<img src={logo} alt="Logo" className={styles['logo-image']} />
				{isNormalTablet && <h1 className={styles['logo-text']}>Rokulezrive</h1>}
			</Link>
			<ul className={styles.features}>
				{isNormalMobile && (
					<li className={styles['feature-item']}>
						<button
							type="button"
							className={styles['feature-button']}
							onClick={onSwitchColorTheme}
							data-testid="feature-button"
						>
							<div className={styles.toggle}>
								<span
									className={`${icon} ${darkTheme ? styles.moon : styles.sun}`}
									data-testid="icon"
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
						data-testid="account-button"
					>
						<span className={`${icon} ${styles.user}`} />
					</button>
				</li>
			</ul>
			<ul
				className={`dropdown ${styles.dropdown} ${classes({
					'dropdown-slide-in': dropdownSlideIn,
					'dropdown-slide-out': dropdownSlideOut,
				})}`}
				data-testid="dropdown"
				onClick={() => onActiveMenu()}
			>
				{!isNormalMobile && (
					<li>
						<button
							type="button"
							className={styles['dropdown-button']}
							onClick={onSwitchColorTheme}
						>
							<span
								className={`${icon} ${darkTheme ? styles.moon : styles.sun}`}
							/>
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
					{isLogin ? (
						<button className={styles['dropdown-link']} onClick={handleLogout}>
							<span className={`${icon} ${styles.logout}`} />
							Logout
						</button>
					) : (
						<Link
							to="/account/login"
							className={`login ${styles['dropdown-link']}`}
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
	dropdownSlideIn: PropTypes.bool,
	onActiveMenu: PropTypes.func,
	onUserId: PropTypes.func,
	isLogin: PropTypes.bool,
};
