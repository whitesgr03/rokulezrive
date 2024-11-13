// Packages
import { NavLink } from 'react-router-dom';

// Styles
import styles from './Navbar.module.css';
import { icon } from '../../../styles/icon.module.css';

export const Navbar = () => {
	const activeLink = ({ isActive }) =>
		isActive
			? `${styles['navbar-link']} ${styles.active}`
			: `${styles['navbar-link']}`;
	return (
		<nav className={styles['navbar']}>
			<ul className={styles['navbar-list']}>
				<li className={styles['navbar-item']}>
					<NavLink to="/drive" end className={activeLink}>
						<span className={`${icon} ${styles.home}`} />
						Home
					</NavLink>
				</li>
				<li className={styles['navbar-item']}>
					<NavLink to="/drive/shared" end className={activeLink}>
						<span className={`${icon} ${styles.shared}`} />
						Shared
					</NavLink>
				</li>
				<li className={styles['navbar-item']}>
					<NavLink to="/drive/folders/my-drive" end className={activeLink}>
						<span className={`${icon} ${styles.drive}`} />
						Files
					</NavLink>
				</li>
			</ul>
		</nav>
	);
};
