// Packages
import { useState, useEffect } from 'react';
import classNames from 'classnames/bind';

// Styles
import styles from './App.module.css';

// Components
import { Header } from '../../layout/Header';
import { Footer } from '../../layout/Footer';
import { Mobile_nav } from '../../layout/Mobile_nav';
import { Home } from '../Home';

// Variables
const classes = classNames.bind(styles);

export const App = () => {
	const [user, setUser] = useState(null);
	const [darkTheme, setDarkTheme] = useState(false);

	const handleSwitchColorTheme = () => {
		setDarkTheme(!darkTheme);
		localStorage.setItem('darkTheme', JSON.stringify(!darkTheme));
	};

	useEffect(() => {
		const darkScheme = localStorage.getItem('darkTheme');

		const browserDarkScheme =
			window.matchMedia('(prefers-color-scheme: dark)')?.matches ?? false;

		darkScheme === null && localStorage.setItem('darkTheme', browserDarkScheme);

		setDarkTheme(
			darkScheme === null ? browserDarkScheme : darkScheme === 'true',
		);
	}, []);

	return (
		<div
			className={`${styles.app} ${classes({
				dark: darkTheme,
				'active-mobile-nav': user,
			})}`}
		>
			<Header
				user={user}
				darkTheme={darkTheme}
				onSwitchColorTheme={handleSwitchColorTheme}
			/>
			<div className={styles.container}>
				<main>
					<Home />
				</main>
				<Footer />
				{user && <Mobile_nav />}
			</div>
		</div>
	);
};
