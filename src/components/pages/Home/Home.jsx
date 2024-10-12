// Packages
import { Link, useOutletContext, Navigate } from 'react-router-dom';
import classNames from 'classnames/bind';

// Styles
import styles from './Home.module.css';

// Assets
import shareImage from '../../../assets/share.jpg';
import manageImage from '../../../assets/manage.jpg';
import heroImage from '../../../assets/hero-bg.png';

// Variables
const classes = classNames.bind(styles);

export const Home = activeMobileNav => {
	const { user } = useOutletContext();

	return (
		<>
			{user ? (
				<Navigate to="/drive" replace={true} />
			) : (
				<div className={styles.home}>
					<div
						className={`${styles.hero} ${classes({
							'active-mobile-nav': activeMobileNav,
						})}`}
					>
						<h2 className={styles['hero-title']}>
							<span className={styles['hero-title-highlight']}>
								Local Drive
							</span>{' '}
							easy to store your content
						</h2>
						<p className={styles['hero-content']}>
							Manage file from your mobile device or computer and sharing file
							to anyone.
						</p>
						<Link className={styles['home-link']} to="/account/login">
							Try Local Drive for free
						</Link>
					</div>
					<div className={styles.container}>
						<div className={styles.introduce}>
							<figure>
								<div className={styles['introduce-image-wrap']}>
									<img
										src={shareImage}
										alt="Introduce of Share File"
										className={styles['introduce-image']}
									/>
								</div>
								<figcaption className={styles.caption}>
									Designed by
									<a href="www.freepik.com"> freepik</a>
								</figcaption>
							</figure>
							<div className={styles['introduce-content']}>
								<h2>Share files and folders with your friend</h2>
								<p>
									Even people without an account can easily access your shared
									files or folders.
								</p>
							</div>
						</div>
						<div className={styles.introduce}>
							<figure>
								<div className={styles['introduce-image-wrap']}>
									<img
										src={manageImage}
										alt="Introduce of Manage File"
										className={styles['introduce-image']}
									/>
								</div>
								<figcaption className={styles.caption}>
									Designed by
									<a href="www.freepik.com"> freepik</a>
								</figcaption>
							</figure>
							<div className={styles['introduce-content']}>
								<h2>Be in manage of your folders</h2>
								<p>
									When sharing, your&apos;re still in control. You can set
									expired links to limit who can access your files or folders.
								</p>
							</div>
						</div>
						<div className={styles.started}>
							<h3>Ready to get started?</h3>
							<Link className={styles['home-link']} to="/account/register">
								Sign up Local Drive
							</Link>
						</div>
					</div>
				</div>
			)}
		</>
	);
};
