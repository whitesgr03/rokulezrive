// Packages
import {
	Link,
	Navigate,
	useOutletContext,
	useLocation,
} from 'react-router-dom';
import classNames from 'classnames/bind';
import { useState } from 'react';
import { object, string } from 'yup';
import { supabase } from '../../../utils/supabase_client';

// Styles
import { icon } from '../../../styles/icon.module.css';
import formStyles from '../../../styles/form.module.css';
import accountStyles from './Account.module.css';
import styles from './Login.module.css';

// Components
import { Account } from './Account';
import { EmailForm } from './Email_Form';

// Variables
const classes = classNames.bind(formStyles);
const REDIRECT =
	import.meta.env.MODE === 'production'
		? import.meta.env.VITE_REDIRECT_URI
		: import.meta.env.VITE_LOCAL_REDIRECT_URI;

// Assets
import googleIcon from '../../../assets/google.png';
import facebookIcon from '../../../assets/facebook.png';

export const Login = () => {
	const { onActiveModal, onUserId } = useOutletContext();

	const [inputErrors, setInputErrors] = useState({});
	const [formData, setFormData] = useState({ email: '', password: '' });
	const [loading, setLoading] = useState(true);
	const [logging, setLogging] = useState(false);
	const [error, setError] = useState(null);
	const { pathname: previousPath } = useLocation();

	const handleChange = e => {
		const { value, name } = e.target;
		const fields = {
			...formData,
			[name]: value,
		};
		setFormData(fields);
	};

	const verifyScheme = async () => {
		let result = {
			success: true,
			fields: {},
		};

		try {
			const schema = object({
				email: string()
					.trim()
					.email('Email must be in standard format.')
					.required('Email is required.'),
				password: string()
					.min(8, 'Password is incorrect.')
					.required('Password is required.'),
			}).noUnknown();
			await schema.validate(formData, {
				abortEarly: false,
				stripUnknown: true,
			});
		} catch (err) {
			for (const error of err.inner) {
				result.fields[error.path] = error.message;
			}
			result.success = false;
		}

		return result;
	};

	const handleLogin = async () => {
		const { email, password } = formData;

		const {
			data: { session },
		} = await supabase.auth.getSession();

		session?.user.user_metadata.resetPassword &&
			(await supabase.auth.updateUser({
				data: { resetPassword: false },
			}));

		const { data, error } = await supabase.auth.signInWithPassword({
			email,
			password,
		});

		const handleError = error => {
			switch (error.code) {
				case 'invalid_credentials':
					setInputErrors({
						...inputErrors,
						email: 'Account could not be found.',
					});
					break;

				case 'email_not_confirmed':
					setInputErrors({
						...inputErrors,
						email: 'Email is registered but not verified.',
					});
					break;

				default:
					setError(error.message);
			}
		};
	const handleSubmit = async e => {
		e.preventDefault();
		setLogging(true);

		const validationResult = await verifyScheme();

		const handleValid = async () => {
			setInputErrors({});
			await handleLogin();
		};

		validationResult.success
			? await handleValid()
			: setInputErrors(validationResult.fields);
		setLogging(false);
	};

	const handleSocialLogin = async provider => {
		setLoading(true);

		supabase.auth.getSession().then(
			({ data: { session } }) =>
				session?.user.user_metadata.resetPassword &&
				supabase.auth.updateUser({
					data: { resetPassword: false },
				}),
		);

		await supabase.auth.signInWithOAuth({
			provider,
			options: {
				redirectTo: REDIRECT,
				queryParams: {
					prompt: 'consent',
				},
			},
		});

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

	return (
		<>
			{error ? (
				<Navigate to="/error" state={{ error, previousPath }} />
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

					<div className={accountStyles['account-link-wrap']}>
						<button
							type="type"
							className={accountStyles['account-link']}
							onClick={() =>
								onActiveModal({
									component: <EmailForm onActiveModal={onActiveModal} />,
								})
							}
						>
							Forget Password?
						</button>
					</div>

					<div className={styles.federation}>
						<button
							className={styles['federation-button']}
							onClick={() => handleSocialLogin('google')}
						>
							<div className={styles.icon}>
								<img src={googleIcon} alt="Google login icon" />
							</div>
							Sign in with Google
						</button>
						<button
							className={styles['federation-button']}
							onClick={() => handleSocialLogin('facebook')}
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
