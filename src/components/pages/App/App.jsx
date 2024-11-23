// Packages
import { useState, useEffect } from 'react';
import classNames from 'classnames/bind';
import { useMediaQuery } from 'react-responsive';
import {
	Outlet,
	ScrollRestoration,
	useNavigate,
	useMatch,
} from 'react-router-dom';
import { supabase } from '../../../utils/supabase_client';

// Styles
import styles from './App.module.css';

// Components
import { Header } from '../../layout/Header/Header';
import { Footer } from '../../layout/Footer/Footer';
import { Navbar } from '../../layout/Navbar/Navbar';
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
	const [userId, setUserId] = useState(null);
	const [darkTheme, setDarkTheme] = useState(false);
	const [menu, setMenu] = useState(DEFAULT_MENU);
	const [modal, setModal] = useState(null);
	const [loading, setLoading] = useState(true);

	const navigate = useNavigate();

	const PublicFilePath = useMatch('/shared/:id');
	const driveErrorPath = useMatch('/drive/error');
	const errorPath = useMatch('/error');
	const resetPasswordPath = useMatch('/account/resetting-password');

	const isNormalTablet = useMediaQuery({ minWidth: 700 });

	const handleCloseMenu = e => {
		const { id, button } = e.target.dataset;

		menu.name !== '' &&
			((!button && !e.target.closest(`.${menu.name}`)) ||
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
		const handleAuthState = async () => {
			const {
				data: { session },
			} = await supabase.auth.getSession();

			const handleSetUser = async () => {
				const incompletePasswordReset =
					session.user.user_metadata.resetPassword;

				const handleInitialSession = id => {
					setUserId(id);

					!PublicFilePath &&
						!driveErrorPath &&
						!errorPath &&
						navigate('/drive', { replace: true });
				};

				const handleIncomplete = async () => {
					await supabase.auth.updateUser({
						data: { resetPassword: false },
					});

					await supabase.auth.signOut();
				};

				incompletePasswordReset
					? await handleIncomplete()
					: handleInitialSession(session.user.id);
			};

			session && !resetPasswordPath && handleSetUser();

			setLoading(false);
		};

		handleAuthState();
	}, [resetPasswordPath, PublicFilePath, driveErrorPath, errorPath, navigate]);

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
							clickToClose={modal.clickToClose}
						>
							{modal.component}
						</Modal>
					)}
					<Header
						darkTheme={darkTheme}
						dropdownSlideIn={menu.name === 'dropdown'}
						onActiveMenu={handleActiveMenu}
						onSwitchColorTheme={handleSwitchColorTheme}
						isLogin={userId !== null}
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
								}}
							/>
						</main>
						{!isNormalTablet && <Footer />}
					</div>
					{!isNormalTablet && userId && (
						<Navbar
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
