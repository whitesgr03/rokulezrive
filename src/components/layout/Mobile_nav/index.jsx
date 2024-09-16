// Packages
import { useMatches } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

// Styles
import styles from './Mobile_nav.module.css';
import { icon } from '../../../styles/icon.module.css';

// Components
import { Folder_Form } from './Folder_Form';

export const Mobile_nav = ({ menu, onActiveModal, onActiveMenu }) => {
	const matches = useMatches();

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
			{matches[1].pathname === '/drive' && (
				<div className={`upload ${styles.upload}`}>
					<button
						type="button"
						className={styles['upload-button']}
						onClick={() =>
							onActiveMenu({
								name: 'upload-menu',
								button: 'upload-button',
							})
						}
						data-button="upload-button"
					>
						<span className={`${icon} ${styles.plus}`} />
					</button>
					{menu.name === 'upload-menu' && (
						<ul className={`upload-menu ${styles['upload-menu']}`}>
							<li>
								<Link
									to="/drive/files/upload"
									className={styles['upload-link']}
									data-close-menu
								>
									<span className={`${icon} ${styles['upload-file']}`} />
									Upload File
								</Link>
							</li>
							<li>
								<button
									className={styles['upload-link']}
									onClick={() => onActiveModal(<Folder_Form />)}
								>
									<span className={`${icon} ${styles['create-folder']}`} />
									Create Folder
								</button>
							</li>
						</ul>
					)}
				</div>
			)}
		</nav>
	);
};

Mobile_nav.propTypes = {
	menu: PropTypes.object,
	onActiveMenu: PropTypes.func,
	onActiveModal: PropTypes.func,
};
