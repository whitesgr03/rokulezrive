// Packages
import { useState, useEffect } from 'react';
import classNames from 'classnames/bind';
import { Outlet } from 'react-router-dom';

// Styles
import styles from './App.module.css';

// Components
import { Header } from '../../layout/Header';
import { Footer } from '../../layout/Footer';

// Variables
const classes = classNames.bind(styles);

export const App = () => {
	const [user, setUser] = useState(null);
	const [darkTheme, setDarkTheme] = useState(false);
	const [activeDropdown, setActiveDropdown] = useState(false);

	const handleSwitchColorTheme = () => {
		setDarkTheme(!darkTheme);
		localStorage.setItem('darkTheme', JSON.stringify(!darkTheme));
	};

	const handleActiveDropdown = e => {
		const target = e.target.closest('.account-button');
		const dropdown = e.target.closest('.dropdown');

		dropdown || (target && !activeDropdown)
			? setActiveDropdown(true)
			: setActiveDropdown(false);
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
			onClick={handleActiveDropdown}
		>
			<Header
				user={user}
				darkTheme={darkTheme}
				activeDropdown={activeDropdown}
				onSwitchColorTheme={handleSwitchColorTheme}
			/>
			<div className={styles.container}>
				<main>
					<Outlet context={{ user }} />
				</main>
				<Footer />
			</div>
		</div>
	);
};
