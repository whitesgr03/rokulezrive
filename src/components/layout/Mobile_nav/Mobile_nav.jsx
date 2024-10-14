// Packages
import { NavLink } from 'react-router-dom';

// Styles
import styles from './Mobile_Nav.module.css';
import { icon } from '../../../styles/icon.module.css';

export const Mobile_Nav = () => {
	const activeLink = ({ isActive }) =>
		isActive
			? `${styles['mobile-nav-link']} ${styles.active}`
			: `${styles['mobile-nav-link']}`;
	return (
		<nav className={styles['mobile-nav']}>
			<ul className={styles['mobile-nav-list']}>
				<li className={styles['mobile-nav-item']}>
					<NavLink to="/drive" end className={activeLink}>
						<span className={`${icon} ${styles.home}`} />
						Home
					</NavLink>
				</li>
				<li className={styles['mobile-nav-item']}>
					<NavLink to="/drive/shared" end className={activeLink}>
						<span className={`${icon} ${styles.shared}`} />
						Shared
					</NavLink>
				</li>
				<li className={styles['mobile-nav-item']}>
					<NavLink to="/drive/folders/my-drive" end className={activeLink}>
						<span className={`${icon} ${styles.drive}`} />
						Files
					</NavLink>
				</li>
			</ul>
		</nav>
	);
};
