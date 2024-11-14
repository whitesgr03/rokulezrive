// Packages
import { Navigate,
	useLocation, } from 'react-router-dom';
import { useState } from 'react';
import classNames from 'classnames/bind';
import PropTypes from 'prop-types';
import { object, string } from 'yup';
import { supabase } from '../../../utils/supabase_client';

// Styles
import { icon } from '../../../styles/icon.module.css';
import formStyles from '../../../styles/form.module.css';
import ValidationEmailStyles from './Validation_Email.module.css';

// Components
import { Loading } from '../../utils/Loading/Loading';
import { ValidationEmail } from './Validation_Email';

// Variables
const classes = classNames.bind(formStyles);

export const EmailForm = ({ onActiveModal }) => {
	const [inputErrors, setInputErrors] = useState({});
	const [formData, setFormData] = useState({ email: '' });
	const [loading, setLoading] = useState(false);
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

	const handleValidationEmail = async () => {
		const result = await supabase.auth.resetPasswordForEmail(formData.email);

		const handleError = error => {
			switch (error.code) {
				case 'over_email_send_rate_limit':
					onActiveModal({
						component: (
							<p>
								You sent the verification email too many times, please try again
								in one hour.
							</p>
						),
					});
					break;
				default:
					setError(error.message);
			}
		};

		const handleSuccess = () => {
			onActiveModal({
				component: (
					<ValidationEmail>
						<p>
							Check your email and find the
							<span className={ValidationEmailStyles.highlight}>
								{' '}
								Rokulezrive Reset Password Verification{' '}
							</span>{' '}
							to reset your password.
						</p>
					</ValidationEmail>
				),
			});
		};

		!result.error ? handleSuccess() : handleError(result.error);
	};

	const handleSubmit = async e => {
		e.preventDefault();

		setLoading(true);

		const validationResult = await verifyScheme();

		const handleValid = async () => {
			setInputErrors({});
			await handleValidationEmail();
		};

		validationResult.success
			? await handleValid()
			: setInputErrors(validationResult.fields);

		setLoading(false);
	};
	return (
		<>
			{error ? (
				<Navigate to="/error" state={{ error, previousPath }} />
			) : (
				<>
					{loading && (
						<Loading text={'Sending...'} light={true} shadow={true} />
					)}
					<form className={formStyles.form} onSubmit={handleSubmit}>
						<h3 className={formStyles.title}>Getting back your account</h3>
						<div className={formStyles['input-wrap']}>
							<label htmlFor="email" className={formStyles['form-label']}>
								Enter your email
								<input
									type="text"
									id="email"
									className={`${classes({
										'form-input': true,
										'form-input-modal-bgc': true,
										'form-input-error': inputErrors.email,
									})}`}
									name="email"
									title="The Email is required."
									onChange={handleChange}
									value={formData.email}
								/>
							</label>
							<p className={formStyles.sign}>
								We{`'`}ll send verification email to confirm it{`'`}s your
								account.
							</p>
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
						<button type="submit" className={formStyles['form-submit']}>
							Continue
						</button>
					</form>
				</>
			)}
		</>
	);
};

EmailForm.propTypes = {
	onActiveModal: PropTypes.func,
};
