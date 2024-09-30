// Packages
import { Link, useOutletContext, Navigate } from 'react-router-dom';
import { useState } from 'react';
import classNames from 'classnames/bind';
import { object, string, ref } from 'yup';

// Styles
import accountStyles from './Account.module.css';
import { icon } from '../../../styles/icon.module.css';
import formStyles from '../../../styles/form.module.css';

// Utils
import { handleFetch } from '../../../utils/handle_fetch';

// Components
import { Account } from './Account';

// Variables
const classes = classNames.bind(formStyles);
const DEFAULT_FORM_DATA = {
	username: '',
	email: '',
	password: '',
	confirmPassword: '',
};

export const Register = () => {
	const { onUser } = useOutletContext();
	const [inputErrors, setInputErrors] = useState({});
	const [formData, setFormData] = useState(DEFAULT_FORM_DATA);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);

	const handleChange = e => {
		const { value, name } = e.target;
		const fields = {
			...formData,
			[name]: value,
		};
		setFormData(fields);
	};

	const handleValidFields = async () => {
		let isValid = false;

		const schema = object({
			username: string()
				.trim()
				.matches(
					/^(?=.*[a-zA-Z0-9]_?)(?=.{4,25})/,
					'Username must contain alphanumeric and underscore characters, and be between 4 and 25 characters.',
				)
				.required('Username is required.'),
			email: string()
				.trim()
				.email('Email must be in standard format.')
				.required('Email is required.'),
			password: string()
				.matches(
					/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/,
					'Password must contain one or more numbers, special symbols, lowercase and uppercase characters, and at least 8 characters.',
				)
				.required('Password is required.'),
			confirmPassword: string()
				.required('Confirm password is required.')
				.oneOf(
					[ref('password')],
					'Confirmation password is not the same as the password.',
				),
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

	const handleRegister = async () => {
		setLoading(true);

		const url = `${import.meta.env.VITE_RESOURCE_URL}/register`;

		const options = {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(formData),
			credentials: 'include',
		};

		const result = await handleFetch(url, options);

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
		isValid && (await handleRegister());
	};

	return (
		<>
			{error ? (
				<Navigate to="/error" state={{ error }} />
			) : (
				<Account title="User Sign Up">
					<div className={accountStyles['account-form-wrap']}>
						<form className={formStyles.form} onSubmit={handleSubmit}>
							<div>
								<label htmlFor="username" className={formStyles['form-label']}>
									Username
									<input
										onChange={handleChange}
										value={formData.username}
										type="text"
										id="username"
										className={classes({
											'form-input': true,
											'form-input-bgc': true,
											'form-input-error': inputErrors.username,
										})}
										name="username"
										title="Username must only contain alphanumeric and underline characters."
									/>
								</label>
								<div
									className={classes({
										'form-message-wrap': true,
										'form-message-active': inputErrors.username,
									})}
								>
									<span className={`${icon} ${formStyles.alert}`} />
									<p className={formStyles['form-message']}>
										{inputErrors ? inputErrors.username : 'Message Placeholder'}
									</p>
								</div>
							</div>
							<div>
								<label htmlFor="email" className={formStyles['form-label']}>
									Email
									<input
										onChange={handleChange}
										value={formData.email}
										type="text"
										id="email"
										className={classes({
											'form-input': true,
											'form-input-bgc': true,
											'form-input-error': inputErrors.email,
										})}
										name="email"
										title="The email is required and must be standard format."
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
										{inputErrors ? inputErrors.email : 'Message Placeholder'}
									</p>
								</div>
							</div>
							<div>
								<label htmlFor="password" className={formStyles['form-label']}>
									Password
									<input
										onChange={handleChange}
										value={formData.password}
										type="password"
										id="password"
										className={`${classes({
											'form-input': true,
											'form-input-bgc': true,
											'form-input-error': inputErrors.password,
										})}`}
										name="password"
										title="The password is required."
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
										{inputErrors ? inputErrors.password : 'Message Placeholder'}
									</p>
								</div>
							</div>
							<div>
								<label
									htmlFor="confirmPassword"
									className={formStyles['form-label']}
								>
									Confirm Password
									<input
										onChange={handleChange}
										value={formData.confirmPassword}
										type="password"
										id="confirmPassword"
										className={`${classes({
											'form-input': true,
											'form-input-bgc': true,
											'form-input-error': inputErrors.confirmPassword,
										})}`}
										name="confirmPassword"
										title="The confirm password must be the same as the password."
									/>
								</label>
								<div
									className={classes({
										'form-message-wrap': true,
										'form-message-active': inputErrors.confirmPassword,
									})}
								>
									<span className={`${icon} ${formStyles.alert}`} />
									<p className={formStyles['form-message']}>
										{inputErrors
											? inputErrors.confirmPassword
											: 'Message Placeholder'}
									</p>
								</div>
							</div>

							<button type="submit" className={formStyles['form-submit']}>
								Submit
							</button>
						</form>
					</div>
					<div className={accountStyles['account-link-wrap']}>
						<p>Already have an account?</p>
						<Link className={accountStyles['account-link']} to="/account/login">
							Sign in account
						</Link>
					</div>
				</Account>
			)}
		</>
	);
};
