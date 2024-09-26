// Packages
import { Link, useOutletContext, Navigate } from 'react-router-dom';
import classNames from 'classnames/bind';
import { useEffect, useState, useRef } from 'react';
import { object, string } from 'yup';

// Styles
import styles from './Login.module.css';
import accountStyles from './Account.module.css';
import { icon } from '../../../styles/icon.module.css';
import formStyles from '../../../styles/form.module.css';

// Utils
import { handleFetch } from '../../../utils/handleFetch';

// Components
import { Account } from './Account';
import { Username_Form } from './Username_Form';

// Variables
const classes = classNames.bind(formStyles);
const DEFAULT_FORM_DATA = { email: '', password: '' };

export const Login = () => {
	const { onUser, onActiveModal, darkTheme } = useOutletContext();
	const [inputErrors, setInputErrors] = useState({});
	const [formData, setFormData] = useState(DEFAULT_FORM_DATA);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);
	const googleRenderButton = useRef(null);

	const handleValidFields = async () => {
		let isValid = false;

		const schema = object({
			email: string()
				.trim()
				.email('The email must be in standard format.')
				.required('The email is required.'),
			password: string()
				.min(8, 'The password is incorrect.')
				.required('The password is required.'),
		}).noUnknown();

		try {
			await schema.validate(formData, {
				abortEarly: false,
				stripUnknown: true,
			});
			setInputErrors({});
			isValid = true;
			return isValid;
		} catch (err) {
			const obj = {};
			for (const error of err.inner) {
				obj[error.path] ?? (obj[error.path] = error.message);
			}
			setInputErrors(obj);
			return isValid;
		}
	};

	const handleLogin = async () => {
		setLoading(true);

		const URL = `${import.meta.env.VITE_RESOURCE_URL}/login`;

		const options = {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(formData),
			credentials: 'include',
		};

		const result = await handleFetch(URL, options);

		const handleSuccess = () => {
			onUser(result.data);
			localStorage.setItem(
				'drive.session-exp',
				JSON.stringify(new Date(result.cookie.exp).getTime()),
			);
		};

		const handleError = () => {
			result.fields
				? setInputErrors({ ...DEFAULT_FORM_DATA, ...result.fields })
				: setError(result.message);
		};

		result.success ? handleSuccess() : handleError();

		setLoading(false);
	};

	const handleSubmit = async e => {
		e.preventDefault();

		const isValid = !loading && (await handleValidFields());
		isValid && (await handleLogin());
	};

	const handleChange = e => {
		const { value, name } = e.target;
		const fields = {
			...formData,
			[name]: value,
		};
		setFormData(fields);
	};

	const handleFacebookUserRegister = async user => {
		const URL = `${import.meta.env.VITE_RESOURCE_URL}/register/facebook`;

		const options = {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(user),
			credentials: 'include',
		};

		const result = await handleFetch(URL, options);

		const handleSuccess = () => {
			onUser(result.data);
			localStorage.setItem(
				'drive.session-exp',
				JSON.stringify(new Date(result.cookie.exp).getTime()),
			);
			onActiveModal({ component: null });
		};

		result.success
			? handleSuccess()
			: result.message && setError(result.message);

		return result?.fields;
	};

	const handleFacebookUserLogin = async res => {
		setLoading(true);

		const { accessToken } = res;

		const URL = `${import.meta.env.VITE_RESOURCE_URL}/login/facebook`;

		const options = {
			method: 'POST',
			headers: {
				Authorization: `Bearer ${accessToken}`,
			},
			credentials: 'include',
		};

		const result = await handleFetch(URL, options);

		const handleSuccess = () => {
			const isRegister = result.data;

			isRegister
				? (() => {
						onUser(result.data);
						localStorage.setItem(
							'drive.session-exp',
							JSON.stringify(new Date(result.cookie.exp).getTime()),
						);
					})()
				: onActiveModal({
						component: (
							<Username_Form onRegister={handleFacebookUserRegister} />
						),
					});
		};

		result.success ? handleSuccess() : setError(result.message);

		setLoading(false);
	};

	useEffect(() => {
		const { google } = window;

		const handleGoogleUserRegister = async user => {
			const URL = `${import.meta.env.VITE_RESOURCE_URL}/register/google`;

			const options = {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(user),
				credentials: 'include',
			};

			const result = await handleFetch(URL, options);

			const handleSuccess = () => {
				onUser(result.data);
				localStorage.setItem(
					'drive.session-exp',
					JSON.stringify(new Date(result.cookie.exp).getTime()),
				);
				onActiveModal({ component: null });
			};

			result.success
				? handleSuccess()
				: result.message && setError(result.message);

			return result?.fields;
		};

		const handleGoogleUserLogin = async res => {
			setLoading(true);

			const { credential } = res;

			const URL = `${import.meta.env.VITE_RESOURCE_URL}/login/google`;

			const options = {
				method: 'POST',
				headers: {
					Authorization: `Bearer ${credential}`,
				},
				credentials: 'include',
			};

			const result = await handleFetch(URL, options);

			const handleSuccess = () => {
				const isRegister = result.data;

				isRegister
					? (() => {
							onUser(result.data);
							localStorage.setItem(
								'drive.session-exp',
								JSON.stringify(new Date(result.cookie.exp).getTime()),
							);
						})()
					: onActiveModal({
							component: (
								<Username_Form onRegister={handleGoogleUserRegister} />
							),
						});
			};

			result.success ? handleSuccess() : setError(result.message);
			setLoading(false);
		};

		google.accounts.id.initialize({
			client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
			callback: handleGoogleUserLogin,
		});

		const initialGoogleButton = () => {
			const maxHeightGoogleButton = 400;
			const computedStyle = getComputedStyle(googleRenderButton.current);
			const border =
				parseFloat(computedStyle.borderLeftWidth) +
				parseFloat(computedStyle.borderRightWidth);

			google.accounts.id.renderButton(googleRenderButton.current, {
				theme: darkTheme ? 'filled_black' : 'outline',
				size: 'large',
				logo_alignment: 'center',
				width:
					googleRenderButton.current.offsetWidth > maxHeightGoogleButton
						? maxHeightGoogleButton - border
						: googleRenderButton.current.offsetWidth - border,
				locale: 'en',
			});
		};

		googleRenderButton.current && initialGoogleButton();
		window.addEventListener('resize', initialGoogleButton);
		return () => window.removeEventListener('resize', initialGoogleButton);
	}, [darkTheme, onUser, onActiveModal]);

	useEffect(() => {
		const { FB } = window;
		FB.init({
			appId: import.meta.env.VITE_FACEBOOK_APP_ID,
			status: true,
			cookie: true,
			xfbml: false,
			version: 'v20.0',
		});
	}, []);
	return (
		<>
			{error ? (
				<Navigate to="/error" state={{ error }} />
			) : (
				<Account title="User Sign in" loading={loading}>
					<div className={accountStyles['account-form-wrap']}>
						<form className={formStyles.form} onSubmit={handleSubmit}>
							<div>
								<label htmlFor="email" className={formStyles['form-label']}>
									Email
									<input
										type="text"
										id="email"
										className={classes({
											'form-input': true,
											'form-input-error': inputErrors.email,
										})}
										name="email"
										title="The email is required and must be standard format."
										onChange={handleChange}
										value={formData.email}
									/>
								</label>
								<div
									className={classes({
										'form-message-wrap': true,
										'form-message-active': inputErrors.email,
									})}
								>
									<span className={`${icon} ${formStyles.alert}`} />
									<p className={formStyles['form-message']}>
										{inputErrors.email
											? inputErrors.email
											: 'Message Placeholder'}
									</p>
								</div>
							</div>
							<div>
								<label htmlFor="password" className={formStyles['form-label']}>
									Password
									<input
										type="password"
										id="password"
										className={`${formStyles['form-input']} ${classes({
											'form-input-error': inputErrors.password,
										})}`}
										name="password"
										title="The password is required."
										onChange={handleChange}
										value={formData.password}
									/>
								</label>
								<div
									className={classes({
										'form-message-wrap': true,
										'form-message-active': inputErrors.password,
									})}
								>
									<span className={`${icon} ${formStyles.alert}`} />
									<p className={formStyles['form-message']}>
										{inputErrors.password
											? inputErrors.password
											: 'Message Placeholder'}
									</p>
								</div>
							</div>

							<button type="submit" className={formStyles['form-submit']}>
								Login
							</button>
						</form>
					</div>

					<div className={styles.federation}>
						<button
							ref={googleRenderButton}
							className={styles['federation-button']}
						></button>
						<button
							className={styles['federation-button']}
							onClick={() => {
								const { FB } = window;

								FB.login(res => {
									res.status === 'connected'
										? handleFacebookUserLogin(res.authResponse)
										: setLoading(false);
								});
							}}
						>
							<svg
								className={styles['federation-button-svg']}
								xmlns="http://www.w3.org/2000/svg"
								width="1em"
								height="1em"
								viewBox="0 0 256 256"
							>
								<path
									fill="#1877f2"
									d="M256 128C256 57.308 198.692 0 128 0S0 57.308 0 128c0 63.888 46.808 116.843 108 126.445V165H75.5v-37H108V99.8c0-32.08 19.11-49.8 48.348-49.8C170.352 50 185 52.5 185 52.5V84h-16.14C152.959 84 148 93.867 148 103.99V128h35.5l-5.675 37H148v89.445c61.192-9.602 108-62.556 108-126.445"
								/>
								<path
									fill="#fff"
									d="m177.825 165l5.675-37H148v-24.01C148 93.866 152.959 84 168.86 84H185V52.5S170.352 50 156.347 50C127.11 50 108 67.72 108 99.8V128H75.5v37H108v89.445A129 129 0 0 0 128 256a129 129 0 0 0 20-1.555V165z"
								/>
							</svg>
							Sign in with Facebook
						</button>
					</div>

					<div className={accountStyles['account-link-wrap']}>
						<p>New to Local Drive?</p>
						<Link
							className={accountStyles['account-link']}
							to="/account/register"
						>
							Create an account
						</Link>
					</div>
				</Account>
			)}
		</>
	);
};
