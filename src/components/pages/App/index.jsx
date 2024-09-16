// Packages
import { useState, useEffect } from 'react';
import classNames from 'classnames/bind';
import { Outlet } from 'react-router-dom';

// Styles
import styles from './App.module.css';

// Components
import { Header } from '../../layout/Header';
import { Footer } from '../../layout/Footer';
import { Mobile_nav } from '../../layout/Mobile_nav';
import { Modal } from './Modal';

// Variables
const classes = classNames.bind(styles);
const DEFAULT_MENU = {
	id: '',
	button: '',
	name: '',
};

export const App = () => {
	const [user, setUser] = useState(null);
	const [darkTheme, setDarkTheme] = useState(false);
	const [menu, setMenu] = useState(DEFAULT_MENU);
	const [modal, setModal] = useState(null);

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

	const handleCloseModel = e => {
		e.target.dataset.closeModel && setModal(null);
		e.target.dataset.closeModel && document.body.removeAttribute('style');
	};

	const handleActiveModal = modal => {
		document.body.style.overflow = 'hidden';
		setModal(modal);
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

	return (
		<div
			className={`${styles.app} ${classes({
				dark: darkTheme,
				'active-mobile-nav': user,
			})}`}
			onClick={handleCloseMenu}
		>
			{modal && (
				<Modal
					onActiveModal={handleActiveModal}
					onCloseModel={handleCloseModel}
				>
					{modal}
				</Modal>
			)}
			<Header
				user={user}
				darkTheme={darkTheme}
				menu={menu}
				onActiveMenu={handleActiveMenu}
				onSwitchColorTheme={handleSwitchColorTheme}
			/>
			<div className={styles.container}>
				<main>
					<Outlet
						context={{
							user,
							onActiveMenu: handleActiveMenu,
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
		</div>
	);
};
