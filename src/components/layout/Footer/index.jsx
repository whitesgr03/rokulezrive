// Styles
import styles from './Footer.module.css';
import { icon } from '../../utils/icon.module.css';

export const Footer = () => {
	return (
		<footer className={styles.footer}>
			<address>
				<ul className={styles['address-list']}>
					<li>
						<a
							className={`${styles['address-link']} ${styles['footer-link']}`}
							href="mailto:whitesgr03@gmail.com"
						>
							<span className={`${icon} ${styles.email}`} />
						</a>
					</li>
					<li>
						<a
							className={`${styles['address-link']} ${styles['footer-link']}`}
							href="https://github.com/whitesgr03/local-drive-react"
							alt="Local Drive Github Repository"
							rel="noreferrer"
							target="_blank"
							aria-label="Visit Project Repository"
						>
							<span className={`${icon} ${styles.github}`} />
						</a>
					</li>
				</ul>
			</address>
			<p>© 2024 Designed & coded by Weiss Bai</p>
		</footer>
	);
};
