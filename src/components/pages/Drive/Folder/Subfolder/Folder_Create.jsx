// Packages
import { useState } from 'react';
import { Navigate, useMatch, useNavigate } from 'react-router-dom';
import classNames from 'classnames/bind';
import { object, string } from 'yup';
import PropTypes from 'prop-types';
import { supabase } from '../../../../../utils/supabase_client';

// Styles
import formStyles from '../../../../../styles/form.module.css';
import { icon } from '../../../../../styles/icon.module.css';

// Components
import { Loading } from '../../../../utils/Loading/Loading';

// Utils
import { handleFetch } from '../../../../../utils/handle_fetch';

// Variables
const classes = classNames.bind(formStyles);

export const Folder_Create = ({ parentId, onAddFolder, onActiveModal }) => {
	const [inputErrors, setInputErrors] = useState({});
	const [formData, setFormData] = useState({ name: '' });
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);

	const matchShared = useMatch('/drive/shared/:id');
	const matchFiles = useMatch('/drive/files/:id');
	const navigate = useNavigate();

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

	const handleCreateSubfolder = async () => {
		setLoading(true);
		const {
			data: {
				session: { access_token },
			},
		} = await supabase.auth.getSession();

		const url = `${import.meta.env.VITE_RESOURCE_URL}/api/folders`;

		const options = {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${access_token}`,
			},
			body: JSON.stringify({ ...formData, parentId }),
		};

		const result = await handleFetch(url, options);

		const handleSuccess = async () => {
			const { parentFolder, newFolder } = result.data;
			onAddFolder(parentFolder, newFolder);
			onActiveModal({ component: null });
			matchShared || (matchFiles && navigate('/'));
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
		isValid && (await handleCreateSubfolder());
	};
	return (
		<>
			{error ? (
				<Navigate to="/error" state={{ error }} />
			) : (
				<>
					{loading && (
						<Loading text={'Creating...'} light={true} shadow={true} />
					)}
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
										'form-input-error': inputErrors.name,
									})}`}
									name="name"
									title="The folder name is required."
									value={formData.folder}
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
							Create
						</button>
					</form>
				</>
			)}
		</>
	);
};

Folder_Create.propTypes = {
	parentId: PropTypes.string,
	onAddFolder: PropTypes.func,
	onActiveModal: PropTypes.func,
};
