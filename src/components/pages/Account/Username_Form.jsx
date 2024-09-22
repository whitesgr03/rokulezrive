// Packages
import { useState } from 'react';
import classNames from 'classnames/bind';
import PropTypes from 'prop-types';
import { object, string } from 'yup';

// Styles
import { icon } from '../../../styles/icon.module.css';
import formStyles from '../../../styles/form.module.css';
import modalStyles from '../../pages/App/Modal.module.css';

// Components
import { Loading } from '../../utils/Loading/Loading';

// Variables
const classes = classNames.bind(formStyles);
const DEFAULT_FORM_DATA = { username: '' };

export const Username_Form = ({ onGoogleUserRegister }) => {
	const [inputErrors, setInputErrors] = useState({});
	const [formData, setFormData] = useState(DEFAULT_FORM_DATA);
	const [loading, setLoading] = useState(false);

	const handleRegister = async () => {
		setLoading(true);
		await onGoogleUserRegister(formData);
		setLoading(false);
	};

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
				.required('Username is required.')
				.min(4, 'Username must be between 4 and 25 letters.')
				.max(25, 'Username must be between 4 and 25 letters.')
				.matches(
					/^\w+$/,
					'Username must only contain alphanumeric and underline characters.',
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

	const handleSubmit = async e => {
		e.preventDefault();

		const isValid = !loading && (await handleValidFields());
		isValid && (await handleRegister());
	};
	return (
		<>
			{loading && <Loading text={'Saving...'} light={true} shadow={true} />}
			<form className={formStyles.form} onSubmit={handleSubmit}>
				<div className={formStyles['input-wrap']}>
					<label htmlFor="username" className={formStyles['form-label']}>
						Username
						<p>Create your local drive username</p>
						<input
							type="text"
							id="username"
							className={`${classes({
								'form-input': true,
								'form-input-error': inputErrors.username,
							})} ${modalStyles['modal-input']}`}
							name="username"
							title="The Username is required."
							onChange={handleChange}
							value={formData.username}
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
				<button type="submit" className={formStyles['form-submit']}>
					Save
				</button>
			</form>
		</>
	);
};

Username_Form.propTypes = {
	onGoogleUserRegister: PropTypes.func,
};
