// Packages
import { useState } from 'react';
import { useMatch, useNavigate, useLocation } from 'react-router-dom';
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

export const FolderCreate = ({ folderId, onUpdateFolder, onActiveModal }) => {
	const [inputErrors, setInputErrors] = useState({});
	const [formData, setFormData] = useState({ name: '' });
	const [loading, setLoading] = useState(false);

	const navigate = useNavigate();
	const { pathname: previousPath } = useLocation();

	const uploadFileFromShared_File = useMatch('/drive/shared/:id');
	const uploadFileFromSubfolderShared_File = useMatch(
		'/drive/folders/:id/shared/:id',
	);
	const uploadFileFromFile_Info = useMatch('/drive/files/:id');
	const uploadFileFromSubfolderFile_Info = useMatch(
		'/drive/folders/:id/files/:id',
	);

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

	const handleCreateSubfolder = async () => {
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
			body: JSON.stringify({ ...formData, folderId }),
		};

		const result = await handleFetch(url, options);

		const handleSuccess = () => {
			onUpdateFolder(result.data);
			(uploadFileFromShared_File || uploadFileFromFile_Info) &&
				navigate('/drive');
			(uploadFileFromSubfolderShared_File ||
				uploadFileFromSubfolderFile_Info) &&
				navigate(`/drive/folders/${folderId}`);
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
	};

	const handleSubmit = async e => {
		e.preventDefault();
		setLoading(true);

		const validationResult = await verifyScheme();

		const handleValid = async () => {
			setInputErrors({});
			await handleCreateSubfolder();
		};

		validationResult.success
			? await handleValid()
			: setInputErrors(validationResult.fields);
		setLoading(false);
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
	);
};

FolderCreate.propTypes = {
	folderId: PropTypes.string,
	onUpdateFolder: PropTypes.func,
	onActiveModal: PropTypes.func,
};
