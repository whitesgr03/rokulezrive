// Packages
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

// Styles
import styles from './Mobile_nav.module.css';
import { icon } from '../../../styles/icon.module.css';

export const Mobile_nav = ({ activeUploadList }) => {
	return (
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
					<Link to="/drive/files" className={styles['mobile-nav-link']}>
						<span className={`${icon} ${styles.drive}`} />
						Files
					</Link>
				</li>
			</ul>
			<div className={`upload ${styles.upload}`}>
				<button type="button" className={styles['upload-button']}>
					<span className={`${icon} ${styles.plus}`} />
				</button>
				{activeUploadList && (
					<ul className={styles['upload-list']}>
						<li>
							<a href="/drive/files/create" className={styles['upload-link']}>
								<span className={`${icon} ${styles['upload-file']}`} />
								Upload File
							</a>
						</li>
						<li>
							<a href="/drive/folders/create" className={styles['upload-link']}>
								<span className={`${icon} ${styles['create-folder']}`} />
								Create Folder
							</a>
						</li>
					</ul>
				)}
			</div>
		</nav>
	);
};

Mobile_nav.propTypes = {
	activeUploadList: PropTypes.bool,
};
