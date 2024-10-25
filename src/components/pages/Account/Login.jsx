// Packages
import { Link, Navigate } from 'react-router-dom';
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

// Variables
const classes = classNames.bind(formStyles);

// Assets
import googleIcon from '../../../assets/google.png';
import facebookIcon from '../../../assets/facebook.png';

export const Login = () => {
	const [inputErrors, setInputErrors] = useState({});
	const [formData, setFormData] = useState({ email: '', password: '' });
	const [loading, setLoading] = useState(false);
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
		const { email, password } = formData;

		const { error } = await supabase.auth.signInWithPassword({
			email,
			password,
		});

		const handleError = error => {
			switch (error.code) {
				case 'invalid_credentials':
					setInputErrors({ ...inputErrors, email: 'Email is not registered.' });
					break;

				case 'email_not_confirmed':
					setInputErrors({ ...inputErrors, email: 'Email not confirmed.' });
					break;

				default:
					setError(error);
			}
		};

		error && handleError(error);
		setLoading(false);
	};

	const handleSocialLogin = async provider => {
		setLoading(true);

		await supabase.auth.signInWithOAuth({
			provider,
			options: {
				redirectTo: `http://localhost:5173/drive`,
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
