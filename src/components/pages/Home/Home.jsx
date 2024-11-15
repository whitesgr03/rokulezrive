// Packages
import { Link, useOutletContext, Navigate } from 'react-router-dom';
import classNames from 'classnames/bind';
import { useMediaQuery } from 'react-responsive';

// Styles
import styles from './Home.module.css';

// Assets
import shareImage from '../../../assets/share.jpg';
import manageImage from '../../../assets/manage.jpg';
import heroImage from '../../../assets/hero-bg.png';

// Variables
const classes = classNames.bind(styles);

export const Home = () => {
	const { userId } = useOutletContext();

	const isNormalDesktop = useMediaQuery({ minWidth: 1000 });

	return (
		<>
			{userId ? (
				<Navigate to="/drive" replace={true} />
			) : (
				<div className={styles.home}>
					<div className={styles['hero-container']}>
						{isNormalDesktop && (
							<>
								<div className={styles['hero-bg']}></div>
								<div className={styles['hero-image-wrap']}>
									<img
										src={heroImage}
										alt="hero image"
										className={styles['introduce-image']}
									/>
									<dir className={styles.attribution}>
										Designed by <a href="www.freepik.com">freepik</a>
									</dir>
								</div>
							</>
						)}
						<div
							className={`${styles.hero} ${classes({
								'active-mobile-nav': userId,
							})}`}
						>
							<h2 className={styles['hero-title']}>
								<span className={styles['hero-title-highlight']}>
									Rokulezrive
								</span>{' '}
								easy to store your content
							</h2>
							<p className={styles['hero-content']}>
								Manage file from your mobile device or computer and sharing file
								to anyone.
							</p>
							<Link className={styles['home-link']} to="/account/login">
								Try Rokulezrive for free
							</Link>
						</div>
					</div>
					<div className={styles.container}>
						<div className={styles.introduce}>
							<figure className={styles.figure}>
								<div className={styles['introduce-image-wrap']}>
									<img
										src={shareImage}
										alt="Introduce of Share File"
										className={styles['introduce-image']}
									/>
								</div>
								<div
									className={`${styles.attribution} ${styles['left-attribution']}`}
								>
									Designed by
									<a href="www.freepik.com"> freepik</a>
								</div>
							</figure>
							<div className={styles['introduce-content']}>
								<h2>Share files and folders with your friend</h2>
								<p>
									Even people without an account can easily access your shared
									files or folders.
								</p>
							</div>
						</div>
						<div
							className={`${styles.introduce} ${isNormalDesktop ? styles['introduce-reverse'] : ''}`}
							data-testid="introduce"
						>
							<figure className={styles.figure}>
								<div className={styles['introduce-image-wrap']}>
									<img
										src={manageImage}
										alt="Introduce of Manage File"
										className={styles['introduce-image']}
									/>
								</div>
								<div className={styles.attribution}>
									Designed by
									<a href="www.freepik.com"> freepik</a>
								</div>
							</figure>
							<div className={styles['introduce-content']}>
								<h2>Be in manage of your files</h2>
								<p>
									When sharing, your&apos;re still in control. You can send
									access links to restrict who can access your files.
								</p>
							</div>
						</div>
						<div className={styles.started}>
							<h3 className={styles['started-title']}>
								<span>Ready to get started?</span>
								{isNormalDesktop && (
									<span>Sign up for a FREE account today!</span>
								)}
							</h3>
							<Link className={styles['home-link']} to="/account/register">
								Join Rokulezrive now
							</Link>
						</div>
					</div>
				</div>
			)}
		</>
	);
};
