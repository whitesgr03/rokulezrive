// Packages
import { Link } from 'react-router-dom';

// Styles
import styles from './Mobile_nav.module.css';
import { icon } from '../../../styles/icon.module.css';

export const Mobile_Nav = () => (
	<nav className={styles['mobile-nav']}>
		<ul className={styles['mobile-nav-list']}>
			<li className={styles['mobile-nav-item']}>
				<Link to="/drive" className={styles['mobile-nav-link']}>
					<span className={`${icon} ${styles.home}`} />
					Home
				</Link>
			</li>
			<li className={styles['mobile-nav-item']}>
				<Link to="/drive/shared" className={styles['mobile-nav-link']}>
					<span className={`${icon} ${styles.shared}`} />
					Shared
				</Link>
			</li>
			<li className={styles['mobile-nav-item']}>
				<Link to="/drive/folder" className={styles['mobile-nav-link']}>
					<span className={`${icon} ${styles.drive}`} />
					Files
				</Link>
			</li>
		</ul>
	</nav>
);
