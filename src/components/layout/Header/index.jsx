// Packages
import { useState } from 'react';
import PropTypes from 'prop-types';
import { useMediaQuery } from 'react-responsive';

// Styles
import styles from './Header.module.css';
import { icon } from '../../../styles/icon.module.css';

// Assets
import logo from '../../../assets/logo.png';


export const Header = ({
	user,
	darkTheme,
	activeDropdown,
	onSwitchColorTheme,
}) => {
	const [activeDropdownSlide, setActiveDropdownSlide] = useState(false);

	const isSmallMobile = useMediaQuery({ maxWidth: 450 });

	const handleActiveDropdown = () => {
		setActiveDropdown(!activeDropdown);
		setActiveDropdownSlide(true);
	};

	const handleCloseDropdown = () => {
		setActiveDropdown(false);
	};

	return (
		<header className={styles.header}>
			<a href="/" className={styles.logo}>
				<img src={logo} alt="Logo" className={styles['logo-image']} />
			</a>
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
						onClick={handleActiveDropdown}
					>
						<span className={`${icon} ${styles.user}`} />
					</button>
				</li>
			</ul>
			<ul
				className={`dropdown ${styles.dropdown} ${classes({
					'dropdown-slide-in': activeDropdown,
					'dropdown-slide-out': activeDropdownSlide,
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
					<a
						href={user ? '/Logout' : '/Login'}
						className={styles['dropdown-link']}
					>
						<span
							className={`${icon} ${user ? styles.logout : styles.login}`}
						/>
						{user ? 'Logout' : 'Login'}
					</a>
				</li>
			</ul>
			{activeDropdown && (
				<div className={styles.close} onClick={handleCloseDropdown} />
			)}
		</header>
	);
};

Header.propTypes = {
	user: PropTypes.object,
	darkTheme: PropTypes.bool,
	activeDropdown: PropTypes.bool,
	onSwitchColorTheme: PropTypes.func,
};
