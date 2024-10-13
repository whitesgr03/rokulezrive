// Packages
import { Navigate } from 'react-router-dom';
import { useState } from 'react';
import classNames from 'classnames/bind';
import PropTypes from 'prop-types';
import { object, string } from 'yup';

// Styles
import { icon } from '../../../styles/icon.module.css';
import formStyles from '../../../styles/form.module.css';

// Components
import { Loading } from '../../utils/Loading/Loading';

import { handleFetch } from '../../../utils/handle_fetch';

// Variables
const classes = classNames.bind(formStyles);

export const Username_Form = ({ type, onUser, onActiveModal }) => {
	const [inputErrors, setInputErrors] = useState({});
	const [formData, setFormData] = useState({ username: '' });
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
					/^(?=\w{4,25}$)(?!.*[_]{2,})[^_].*[^_]$/,
					'Username can only contain alphanumeric and non-consecutive underscore characters, and be between 4 and 25 characters.',
				)
				.required('Username is required.'),
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

		const url = `${import.meta.env.VITE_RESOURCE_URL}/register/${type}`;

		const options = {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'X-Requested-With': 'XmlHttpRequest',
			},
			body: JSON.stringify(formData),
			credentials: 'include',
		};

		const result = await handleFetch(url, options);

		const handleError = () => {
			result.fields
				? setInputErrors({ ...result.fields })
				: setError(result.message);
		};

		const handleSuccess = () => {
			localStorage.setItem(
				'drive.session-exp',
				JSON.stringify(new Date(result.cookie.exp).getTime()),
			);
			onUser(result.data);
			onActiveModal({ component: null });
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
				<>
					{loading && <Loading text={'Saving...'} light={true} shadow={true} />}
					<form className={formStyles.form} onSubmit={handleSubmit}>
						<div className={formStyles['input-wrap']}>
							<label htmlFor="username" className={formStyles['form-label']}>
								Create Local Drive username
								<input
									type="text"
									id="username"
									className={`${classes({
										'form-input': true,
										'form-input-modal-bgc': true,
										'form-input-error': inputErrors.username,
									})}`}
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
			)}
		</>
	);
};

Username_Form.propTypes = {
	type: PropTypes.string,
	onUser: PropTypes.func,
	onActiveModal: PropTypes.func,
};
