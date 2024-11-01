// Packages
import { useState, useEffect } from 'react';
import classNames from 'classnames/bind';
import { useMediaQuery } from 'react-responsive';
import {
	Outlet,
	ScrollRestoration,
	useNavigate,
	useMatches,
	useMatch,
} from 'react-router-dom';
import { supabase } from '../../../utils/supabase_client';

// Styles
import styles from './App.module.css';

// Components
import { Header } from '../../layout/Header/Header';
import { Footer } from '../../layout/Footer/Footer';
import { Mobile_Nav } from '../../layout/Mobile_Nav/Mobile_Nav';
import { Modal } from './Modal';
import { Loading } from '../../utils/Loading/Loading';

// Variables
const classes = classNames.bind(styles);
const DEFAULT_MENU = {
	id: '',
	button: '',
	name: '',
};

export const App = () => {
	const [resetPassword, setResetPassword] = useState(false);
	const [cancelResetPassword, setCancelResetPassword] = useState(false);
	const [userId, setUserId] = useState(null);
	const [darkTheme, setDarkTheme] = useState(false);
	const [menu, setMenu] = useState(DEFAULT_MENU);
	const [modal, setModal] = useState(null);
	const [loading, setLoading] = useState(true);

	const navigate = useNavigate();
	const matches = useMatches();
	const isPublicFile = useMatch('/shared/:id');

	const isNormalTablet = useMediaQuery({ minWidth: 700 });

	const handleCloseMenu = e => {
		const { id, button, closeMenu } = e.target.dataset;

		menu.name !== '' &&
			(closeMenu ||
				(!button && !e.target.closest(`.${menu.name}`)) ||
				id === menu.id ||
				(!id && button === menu.button)) &&
			setMenu(DEFAULT_MENU);
	};

	const handleActiveMenu = menu => {
		menu ? setMenu({ ...DEFAULT_MENU, ...menu }) : setMenu(DEFAULT_MENU);
	};

	const handleSwitchColorTheme = () => {
		setDarkTheme(!darkTheme);
		localStorage.setItem('darkTheme', JSON.stringify(!darkTheme));
	};

	const handleCloseModal = e => {
		e.target.dataset.closeModal === 'true' && setModal(null);
		e.target.dataset.closeModal === 'true' &&
			document.body.removeAttribute('style');
	};

	const handleActiveModal = ({ component, clickToClose = true }) => {
		document.body.removeAttribute('style');
		component && (document.body.style.overflow = 'hidden');
		component ? setModal({ component, clickToClose }) : setModal(null);
	};

	useEffect(() => {
		const getColorTheme = () => {
			const darkScheme = localStorage.getItem('darkTheme');

			const browserDarkScheme =
				window.matchMedia('(prefers-color-scheme: dark)')?.matches ?? false;

			darkScheme === null &&
				localStorage.setItem('darkTheme', browserDarkScheme);

			setDarkTheme(
				darkScheme === null ? browserDarkScheme : darkScheme === 'true',
			);
		};
		getColorTheme();
	}, []);

	useEffect(() => {
		const {
			data: { subscription },
		} = supabase.auth.onAuthStateChange((event, session) => {
			console.log(session);
			console.log(event);

			const handleSetUser = session => {
				setUserId(session.user.id);
				matches[1].pathname !== '/drive' && !isPublicFile && navigate('/drive');
			};

			const handleSetMetaData = () => {
				setCancelResetPassword(true);
				navigate('/', { replace: true, state: {} });

				supabase.auth
					.updateUser({
						data: { resetPassword: false },
					})
					.then(async () => {
						await supabase.auth.signOut();
						setCancelResetPassword(false);
					});
			};

			const metadata_resetPassword = session?.user.user_metadata.resetPassword;

			switch (event) {
				case 'PASSWORD_RECOVERY':
					setResetPassword(true);
					navigate('/account/resetting-password', {
						state: { resetPassword: true },
					});
					break;

				case 'SIGNED_IN':
				case 'TOKEN_REFRESHED':
				case 'INITIAL_SESSION':
					!resetPassword &&
						((metadata_resetPassword && handleSetMetaData()) ||
							(!metadata_resetPassword &&
								!cancelResetPassword &&
								session &&
								handleSetUser(session)));
					break;
			}

			setLoading(false);
		});

		return () => subscription.unsubscribe();
	}, [navigate, matches, resetPassword, isPublicFile, cancelResetPassword]);

	return (
		<div
			className={`${styles.app} ${classes({
				dark: darkTheme,
				'active-mobile-nav': !isNormalTablet && userId,
			})}`}
			onClick={handleCloseMenu}
		>
			{loading ? (
				<Loading text={'Loading...'} />
			) : (
				<>
					<ScrollRestoration getKey={location => location.key} />
					{modal && (
						<Modal
							onActiveModal={handleActiveModal}
							onCloseModal={handleCloseModal}
							clickToClose={modal.clickToClose}
						>
							{modal.component}
						</Modal>
					)}
					<Header
						darkTheme={darkTheme}
						menu={menu}
						onActiveMenu={handleActiveMenu}
						onSwitchColorTheme={handleSwitchColorTheme}
						userId={userId}
						onUserId={setUserId}
					/>
					<div className={styles.container}>
						<main>
							<Outlet
								context={{
									onActiveMenu: handleActiveMenu,
									onActiveModal: handleActiveModal,
									menu,
									darkTheme,
									userId,
									onUserId: setUserId,
									onResetPassword: setResetPassword,
								}}
							/>
						</main>
						{!isNormalTablet && <Footer />}
					</div>
					{!isNormalTablet && userId && (
						<Mobile_Nav
							menu={menu}
							onActiveModal={handleActiveModal}
							onActiveMenu={handleActiveMenu}
						/>
					)}
				</>
			)}
		</div>
	);
};
