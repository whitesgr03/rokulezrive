// Packages
import { useState } from 'react';
import classNames from 'classnames/bind';
import { object, string } from 'yup';
import PropTypes from 'prop-types';

// Styles
import formStyles from '../../../../styles/form.module.css';
import { icon } from '../../../../styles/icon.module.css';

// Components
import { Loading } from '../../../utils/Loading/Loading';

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
		<>
			{loading && <Loading text={'Creating...'} light={true} shadow={true} />}
			<form className={formStyles.form} onSubmit={handleSubmit}>
				<div className={formStyles['input-wrap']}>
					<label htmlFor="name" className={formStyles['form-label']}>
						Folder Name
						<input
							type="text"
							id="name"
							className={`${classes({
								'form-input': true,
								'form-input-modal-bgc': true,
								'form-input-error': inputErrors.folder,
							})}`}
							name="name"
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
		</>
	);
};

Folder_Create.propTypes = {
	onCreateSubfolder: PropTypes.func,
};
