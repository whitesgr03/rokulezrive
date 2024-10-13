// Packages
import classNames from 'classnames/bind';
import { Navigate } from 'react-router-dom';
import { useState } from 'react';
import { object, string } from 'yup';
import PropTypes from 'prop-types';

// Styles
import { icon } from '../../../../../styles/icon.module.css';
import formStyles from '../../../../../styles/form.module.css';

// Components
import { Loading } from '../../../../utils/Loading/Loading';

// Utils
import { handleFetch } from '../../../../../utils/handle_fetch';

// Variables
const classes = classNames.bind(formStyles);

export const File_Update = ({
	name,
	folderId,
	fileId,
	onGetFolder,
	onActiveModal,
}) => {
	const [inputErrors, setInputErrors] = useState({});
	const [formData, setFormData] = useState({ name });
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
			name: string()
				.trim()
				.required('Folder name is required.')
				.max(200, ({ max }) => `Folder name must be less then ${max} letters.`),
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

	const handleUpdate = async () => {
		setLoading(true);

		const url = `${import.meta.env.VITE_RESOURCE_URL}/api/files/${fileId}`;

		const options = {
			method: 'PATCH',
			headers: {
				'Content-Type': 'application/json',
				'X-Requested-With': 'XmlHttpRequest',
			},
			body: JSON.stringify(formData),
			credentials: 'include',
		};

		const result = await handleFetch(url, options);

		const handleSuccess = () => {
			onGetFolder(folderId);
			onActiveModal({ component: null });
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
		isValid && (await handleUpdate());
	};

	return (
		<>
			{error ? (
				<Navigate to="/error" state={{ error }} />
			) : (
				<>
					{loading && <Loading text={'Saving...'} light={true} shadow={true} />}
					<form className={formStyles.form} onSubmit={handleSubmit}>
						<div>
							<label htmlFor="name" className={formStyles['form-label']}>
								Rename File
								<input
									type="text"
									id="name"
									className={`${classes({
										'form-input': true,
										'form-input-modal-bgc': true,
										'form-input-error': inputErrors.name,
									})}`}
									name="name"
									value={formData.name}
									title="The File name is required."
									onChange={handleChange}
									autoFocus
								/>
							</label>
							<div
								className={classes({
									'form-message-wrap': true,
									'form-message-active': inputErrors.name,
								})}
							>
								<span className={`${icon} ${formStyles.alert}`} />
								<p className={formStyles['form-message']}>
									{inputErrors.name ? inputErrors.name : 'Message Placeholder'}
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

File_Update.propTypes = {
	name: PropTypes.string,
	folderId: PropTypes.string,
	fileId: PropTypes.string,
	onGetFolder: PropTypes.func,
	onActiveModal: PropTypes.func,
};
