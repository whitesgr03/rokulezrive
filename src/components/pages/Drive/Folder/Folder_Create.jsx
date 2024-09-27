// Packages
import { useState } from 'react';
import classNames from 'classnames/bind';
import { object, string } from 'yup';
import PropTypes from 'prop-types';

// Styles
import { icon } from '../../../../styles/icon.module.css';
import formStyles from '../../../../styles/form.module.css';
import modalStyles from '../../App/Modal.module.css';

// Utils
import { handleFetch } from '../../../../utils/handleFetch';

// Variables
const classes = classNames.bind(formStyles);

export const Folder_Create = ({ onCreateSubfolder }) => {
	const [inputErrors, setInputErrors] = useState({});
	const [formData, setFormData] = useState({ name: '' });
	const [loading, setLoading] = useState(false);

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
			folder: string()
				.trim()
				.required('Folder is required.')
				.max(200, ({ max }) => `Folder must be less then ${max} letters.`),
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

	const handleCreate = async () => {
		setLoading(true);

		const fields = await onCreateSubfolder(formData);

		fields && setInputErrors({ ...fields });

		setLoading(false);
	};

	const handleSubmit = async e => {
		e.preventDefault();

		const isValid = !loading && (await handleValidFields());
		isValid && (await handleCreate());
	};
	return (
		<form className={formStyles.form} onSubmit={handleSubmit}>
			<div className={formStyles['input-wrap']}>
				<label htmlFor="folder" className={formStyles['form-label']}>
					Folder Name
					<input
						type="text"
						id="folder"
						className={`${classes({
							'form-input': true,
							'form-input-error': inputErrors.folder,
						})} ${modalStyles['modal-input']}`}
						name="folder"
						title="The folder name is required."
						value={formData.folder}
						onChange={handleChange}
					/>
				</label>
				<div
					className={classes({
						'form-message-wrap': true,
						'form-message-active': inputErrors.folder,
					})}
				>
					<span className={`${icon} ${formStyles.alert}`} />
					<p className={formStyles['form-message']}>
						{inputErrors ? inputErrors.folder : 'Message Placeholder'}
					</p>
				</div>
			</div>

			<button type="submit" className={formStyles['form-submit']}>
				Create
			</button>
		</form>
	);
};

Folder_Create.propTypes = {
	onCreateSubfolder: PropTypes.func,
};
