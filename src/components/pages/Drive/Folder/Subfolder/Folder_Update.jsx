// Packages
import classNames from 'classnames/bind';
import { useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { object, string } from 'yup';
import PropTypes from 'prop-types';
import { supabase } from '../../../../../utils/supabase_client';

// Styles
import { icon } from '../../../../../styles/icon.module.css';
import formStyles from '../../../../../styles/form.module.css';

// Components
import { Loading } from '../../../../utils/Loading/Loading';

// Utils
import { handleFetch } from '../../../../../utils/handle_fetch';

// Variables
const classes = classNames.bind(formStyles);

export const FolderUpdate = ({ folder, onUpdateFolder, onActiveModal }) => {
	const { name, id: folderId } = folder;

	const [inputErrors, setInputErrors] = useState({});
	const [formData, setFormData] = useState({ name });
	const [loading, setLoading] = useState(false);

	const { pathname: previousPath } = useLocation();
	const navigate = useNavigate();

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
				name: string()
					.trim()
					.max(
						200,
						({ max }) => `Folder name must be less then ${max} letters.`,
					)
					.required('Folder name is required.'),
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

	const handleUpdate = async () => {
		setLoading(true);

		const {
			data: {
				session: { access_token },
			},
		} = await supabase.auth.getSession();

		const url = `${import.meta.env.VITE_RESOURCE_URL}/api/folders/${folderId}`;

		const options = {
			method: 'PATCH',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${access_token}`,
			},
			body: JSON.stringify(formData),
		};

		const result = await handleFetch(url, options);

		const handleSuccess = () => {
			onUpdateFolder(result.data);
			onActiveModal({ component: null });
		};

		const handleError = () => {
			navigate('/drive/error', {
				state: { error: result.message, previousPath },
			});
			onActiveModal({ component: null });
		};

		result.success
			? handleSuccess()
			: result.fields
				? setInputErrors({ ...result.fields })
				: handleError();

		setLoading(false);
	};

	const handleSubmit = async e => {
		e.preventDefault();

		const isValid = !loading && (await handleValidFields());
		isValid && (await handleUpdate());
	};

	return (
		<>
			{loading && <Loading text={'Saving...'} light={true} shadow={true} />}
			<form className={formStyles.form} onSubmit={handleSubmit}>
				<div>
					<label htmlFor="name" className={formStyles['form-label']}>
						Rename Folder
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
							title="The Folder name is required."
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
	);
};

FolderUpdate.propTypes = {
	folder: PropTypes.object,
	onUpdateFolder: PropTypes.func,
	onActiveModal: PropTypes.func,
};
