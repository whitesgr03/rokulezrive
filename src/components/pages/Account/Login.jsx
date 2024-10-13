// Packages
import {
	Link,
	useOutletContext,
	Navigate,
	useSearchParams,
	useNavigate,
} from 'react-router-dom';
import classNames from 'classnames/bind';
import { useState, useEffect } from 'react';
import { object, string } from 'yup';

// Styles
import { icon } from '../../../styles/icon.module.css';
import formStyles from '../../../styles/form.module.css';
import accountStyles from './Account.module.css';
import styles from './Login.module.css';

// Utils
import { handleFetch } from '../../../utils/handle_fetch';

// Components
import { Account } from './Account';
import { Username_Form } from './Username_Form';

// Variables
const classes = classNames.bind(formStyles);

// Assets
import googleIcon from '../../../assets/google.png';
import facebookIcon from '../../../assets/facebook.png';

export const Login = () => {
	const [searchParams] = useSearchParams();
	const navigate = useNavigate();

	const code = searchParams.get('code');
	const state = searchParams.get('state');
	const errorParams = searchParams.get('error');

	const { onUser, onActiveModal } = useOutletContext();
	const [inputErrors, setInputErrors] = useState({});
	const [formData, setFormData] = useState({ email: '', password: '' });
	const [loading, setLoading] = useState(code ? true : false);
	const [error, setError] = useState(null);

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
				'X-Requested-With': 'XmlHttpRequest',
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
				? setInputErrors({ ...result.fields })
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

	const generateRandomString = () => {
		const characters =
			'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
		return Array.from(
			window.crypto.getRandomValues(new Uint32Array(32)),
			value => characters.charAt(value % characters.length),
		).join('');
	};

	const handleFacebookUserLogin = async () => {
		setLoading(true);

		const state = generateRandomString();

		localStorage.setItem('facebook_state', state);

		const url =
			'https://www.facebook.com/v21.0/dialog/oauth?' +
			`client_id=${import.meta.env.VITE_FACEBOOK_APP_ID}` +
			`&redirect_uri=${import.meta.env.VITE_REDIRECT_URI}` +
			`&state=${state}` +
			'&auth_type=rerequest' +
			'&scope=public_profile';

		window.location.replace(url);
	};

	const handleGoogleUserLogin = () => {
		setLoading(true);
		const { google } = window;

		const state = generateRandomString();

		localStorage.setItem('google_state', state);

		google.accounts.oauth2
			.initCodeClient({
				client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
				scope:
					'https://www.googleapis.com/auth/userinfo.email ' +
					'https://www.googleapis.com/auth/userinfo.profile ' +
					'openid',
				ux_mode: 'redirect',
				redirect_uri: `${import.meta.env.VITE_REDIRECT_URI}`,
				state,
			})
			.requestCode();
	};

	useEffect(() => {
		const controller = new AbortController();
		const { signal } = controller;

		const facebookState = localStorage.getItem('facebook_state');
		const googleState = localStorage.getItem('google_state');

		const handleLogin = async type => {
			const url = `${import.meta.env.VITE_RESOURCE_URL}/login/${type}`;

			const options = {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'X-Requested-With': 'XmlHttpRequest',
				},
				signal,
				body: JSON.stringify({ code }),
				credentials: 'include',
			};

			const result = await handleFetch(url, options);

			const handleSuccess = () => {
				localStorage.removeItem('google_state');
				localStorage.removeItem('facebook_state');

				result.data
					? (() => {
							onUser(result.data);
							localStorage.setItem(
								'drive.session-exp',
								JSON.stringify(new Date(result.cookie.exp).getTime()),
							);
						})()
					: onActiveModal({
							component: (
								<Username_Form
									type={type}
									onUser={onUser}
									onActiveModal={onActiveModal}
								/>
							),
						});
			};

			const handleResult = () => {
				result.success ? handleSuccess() : setError(result.message);
				setLoading(false);
			};

			result && handleResult();
		};

		code && state === facebookState && handleLogin('facebook');
		code && state === googleState && handleLogin('google');

		errorParams && navigate('/account/login');

		return () => controller.abort();
	}, [code, state, errorParams, navigate, onActiveModal, onUser]);

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
											'form-input-bgc': true,
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
										className={`${classes({
											'form-input': true,
											'form-input-bgc': true,
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

							<button
								type="submit"
								className={`${formStyles['form-submit']} ${accountStyles.submit}`}
							>
								Login
							</button>
						</form>
					</div>

					<div className={styles.federation}>
						<button
							className={styles['federation-button']}
							onClick={handleGoogleUserLogin}
						>
							<div className={styles.icon}>
								<img src={googleIcon} alt="Google login icon" />
							</div>
							Sign in with Google
						</button>
						<button
							className={styles['federation-button']}
							onClick={handleFacebookUserLogin}
						>
							<div className={styles.icon}>
								<img src={facebookIcon} alt="Facebook login icon" />
							</div>
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
