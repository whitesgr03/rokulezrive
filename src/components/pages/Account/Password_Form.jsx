// Packages
import {
	useLocation,
	Navigate,
	useNavigate,
	useOutletContext,
} from 'react-router-dom';
import { useEffect, useState } from 'react';
import classNames from 'classnames/bind';
import { object, string, ref } from 'yup';
import { supabase } from '../../../utils/supabase_client';

// Styles
import accountStyles from './Account.module.css';
import { icon } from '../../../styles/icon.module.css';
import formStyles from '../../../styles/form.module.css';

// Components
import { Account } from './Account';

// Variables
const classes = classNames.bind(formStyles);
const DEFAULT_FORM_DATA = {
	password: '',
	confirmPassword: '',
};

export const PasswordForm = () => {
	const { onActiveModal, onResetPassword } = useOutletContext();
	const { state } = useLocation();
	const navigate = useNavigate();

	const [inputErrors, setInputErrors] = useState({});
	const [formData, setFormData] = useState(DEFAULT_FORM_DATA);
	const [loading, setLoading] = useState(true);
	const [resetting, setResetting] = useState(false);

	const verifyScheme = async () => {
		let result = {
			success: true,
			fields: {},
		};

		try {
			const schema = object({
				password: string()
					.matches(
						/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*()_+-=[\]{};':"|<>?,./`~])(?=.{8,})/,
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

	const handleChange = e => {
		const { value, name } = e.target;
		const fields = {
			...formData,
			[name]: value,
		};
		setFormData(fields);
	};

	const handlePasswordReset = async () => {
		const result = await supabase.auth.updateUser({
			password: formData.password,
			data: { resetPassword: false },
		});

		const handleError = error => {
			switch (error.code) {
				case 'same_password':
					setInputErrors({
						...inputErrors,
						password: 'New password should be different from the old password.',
					});
					break;
				default:
					navigate('/error', { replace: true, state: { error } });
			}
		};

		const handleSuccess = async () => {
			onActiveModal({
				component: (
					<p>Password reset successful, please use new password to log in.</p>
				),
			});
			await supabase.auth.signOut();
			onResetPassword(false);
			navigate('/account/login', { replace: true, state: {} });
		};

		!result.error ? await handleSuccess() : handleError(result.error);
	};

	const handleSubmit = async e => {
		e.preventDefault();
		setResetting(true);

		const validationResult = await verifyScheme();

		const handleValid = async () => {
			setInputErrors({});
			await handlePasswordReset();
		};

		validationResult.success
			? await handleValid()
			: setInputErrors(validationResult.fields);

		setResetting(false);
	};

	useEffect(() => {
		const handleSetMetaData = async () => {
			await supabase.auth.updateUser({
				data: { resetPassword: true },
			});
		};
		handleSetMetaData();
	}, []);

	return (
		<>
			{state?.resetPassword ? (
				<Account title="Reset Password" loading={loading}>
					<div className={accountStyles['account-form-wrap']}>
						<form className={formStyles.form} onSubmit={handleSubmit}>
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

							<button type="submit" className={`${formStyles['form-submit']}`}>
								Submit
							</button>
						</form>
					</div>
				</Account>
			) : (
				<Navigate to="/" replace={true} />
			)}
		</>
	);
};
