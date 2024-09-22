// Packages
import { useState, useEffect } from 'react';
import classNames from 'classnames/bind';
import { Outlet, Navigate } from 'react-router-dom';

// Styles
import styles from './App.module.css';

// Utils
import { handleFetch } from '../../../utils/handleFetch';

// Components
import { Header } from '../../layout/Header';
import { Footer } from '../../layout/Footer';
import { Mobile_nav } from '../../layout/Mobile_nav';
import { Modal } from './Modal';
import { Loading } from '../../utils/Loading/Loading';

// Variables
const classes = classNames.bind(styles);
const DEFAULT_MENU = {
	id: '',
	button: '',
	name: '',
};
const URL = `${import.meta.env.VITE_RESOURCE_URL}/account/user`;

export const App = () => {
	const [user, setUser] = useState(null);
	const [darkTheme, setDarkTheme] = useState(false);
	const [menu, setMenu] = useState(DEFAULT_MENU);
	const [modal, setModal] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

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
		setMenu({ ...DEFAULT_MENU, ...menu });
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

	const handleActiveModal = ({ component, clickToClose = null }) => {
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
		const controller = new AbortController();
		const { signal } = controller;

		const handleGetUser = async () => {
			const options = {
				method: 'GET',
				signal,
				credentials: 'include',
			};

			const result = await handleFetch(URL, options);

			const handleSuccess = () => {
				result.success ? setUser(result.data) : setError(result.message);
				setLoading(false);
			};

			result && handleSuccess();
		};

		const sessionExp = localStorage.getItem('drive.session-exp') ?? false;

		const removeExp = () => {
			localStorage.removeItem('drive.session-exp');
			setLoading(false);
		};

		!sessionExp
			? setLoading(false)
			: Date.now() > new Date(JSON.parse(sessionExp)).getTime()
				? removeExp()
				: handleGetUser();

		return () => controller.abort();
	}, []);

	return (
		<>
			{error ? (
				<Navigate to="/error" state={{ error }} />
			) : (
				<div
					className={`${styles.app} ${classes({
						dark: darkTheme,
						'active-mobile-nav': user,
					})}`}
					onClick={handleCloseMenu}
				>
					{loading ? (
						<Loading text={'Loading...'} />
					) : (
						<>
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
								user={user}
								darkTheme={darkTheme}
								menu={menu}
								onActiveMenu={handleActiveMenu}
								onUser={setUser}
								onSwitchColorTheme={handleSwitchColorTheme}
							/>
							<div className={styles.container}>
								<main>
									<Outlet
										context={{
											user,
											onActiveMenu: handleActiveMenu,
											onActiveModal: handleActiveModal,
											onUser: setUser,
											menu,
										}}
									/>
								</main>
								<Footer />
							</div>
							{user && (
								<Mobile_nav
									menu={menu}
									onActiveModal={handleActiveModal}
									onActiveMenu={handleActiveMenu}
								/>
							)}
						</>
					)}
				</div>
			)}
		</>
	);
};
