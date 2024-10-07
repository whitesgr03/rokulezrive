// Packages
import classNames from 'classnames/bind';
import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { object, string } from 'yup';

// Styles
import { icon } from '../../../../../styles/icon.module.css';
import formStyles from '../../../../../styles/form.module.css';
import styles from './File_Share.module.css';

// Components
import { Loading } from '../../../../utils/Loading/Loading';

// Utils
import { handleFetch } from '../../../../../utils/handle_fetch';

// Variables
const classes = classNames.bind(formStyles);

export const File_Share = ({
	name,
	sharers,
	publicId,
	folderId,
	fileId,
	onGetFolder,
	onActiveModal,
}) => {
	const [newPublicId, setNewPublicId] = useState(publicId);
	const [isPublic, setIsPublic] = useState(publicId !== '');

	const [newSharers, setNewSharers] = useState(sharers);

	const [formData, setFormData] = useState({ username: '' });
	const [inputErrors, setInputErrors] = useState({});
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
			username: string().trim().required('Username is required.'),
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

	const handleCreateSharer = async () => {
		setLoading(true);

		const url = `${import.meta.env.VITE_RESOURCE_URL}/api/files/${fileId}/sharers`;

		const options = {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
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
			setNewSharers([...newSharers, result.data]);
			setFormData({ ...formData, username: '' });
			onGetFolder(folderId);
		};

		result.success ? handleSuccess() : handleError();
		setLoading(false);
	};

	const handleSubmit = async e => {
		e.preventDefault();
		const isValid = !loading && (await handleValidFields());
		isValid && (await handleCreateSharer());
	};

	const handleDeleteSharer = async sharerId => {
		setLoading(true);

		const url = `${import.meta.env.VITE_RESOURCE_URL}/api/files/${fileId}/sharers/${sharerId}`;

		const options = {
			method: 'DELETE',
			credentials: 'include',
		};

		const result = await handleFetch(url, options);

		const handleSuccess = () => {
			setNewSharers(newSharers.filter(item => item.sharer.id !== sharerId));
			onGetFolder(folderId);
		};

		result.success ? handleSuccess() : setError(result.message);
		setLoading(false);
	};

	const handlePublicFile = async () => {
		setLoading(true);

		const setPublic = async () => {
			let url = `${import.meta.env.VITE_RESOURCE_URL}/api/files/${fileId}/public`;

			const options = {
				method: 'POST',
				credentials: 'include',
			};

			return await handleFetch(url, options);
		};

		const setPrivate = async () => {
			let url = `${import.meta.env.VITE_RESOURCE_URL}/api/public/${newPublicId}`;

			const options = {
				method: 'DELETE',
				credentials: 'include',
			};

			return await handleFetch(url, options);
		};

		const result = isPublic ? await setPrivate() : await setPublic();

		const handleSuccess = () => {
			!isPublic && setNewPublicId(result.data);
			setIsPublic(!isPublic);
			onGetFolder(folderId);
		};

		result.success ? handleSuccess() : setError(result.message);

		setLoading(false);
	};

	const handleCopyLink = async () => {
		await navigator.clipboard.writeText(
			`${location.protocol}//${location.host}/shared/${sharing.id}`,
		);
	};

	const listSharers = newSharers.map(item => {
		return (
			<div key={`${item.sharer.id}`} className={`${styles['username-item']} `}>
				<span className={`${styles['username-text']}`}>
					{item.sharer.username}
				</span>
				<button
					type="button"
					className={`${styles['username-close']}`}
					onClick={() => handleDeleteSharer(item.sharer.id)}
				>
					<span className={`${icon} ${styles.close}`} />
				</button>
			</div>
		);
	});

	return (
		<>
			{error ? (
				<Navigate to="/error" state={{ error }} />
			) : (
				<>
					{loading && <Loading text={'Saving...'} light={true} shadow={true} />}
					<div className={styles.container}>
						<h3>Share {`"${name}"`}</h3>
						<form className={formStyles.form} onSubmit={handleSubmit}>
							<div className={styles.wrap}>
								{newSharers.length > 0 && (
									<ul className={styles['username-list']}>{listSharers}</ul>
								)}
								<label htmlFor="username" className={styles['label']}>
									Share people with username
									<div className={styles['input-wrap']}>
										<input
											type="text"
											id="username"
											className={`${classes({
												'form-input': true,
												'form-input-modal-bgc': true,
												'form-input-error': inputErrors.username,
											})} ${styles.input}`}
											name="username"
											value={formData.username}
											onChange={handleChange}
										/>
										<button type="submit" className={styles['input-button']}>
											<span className={`${icon} ${styles.add}`} />
										</button>
									</div>
								</label>

								<label
									htmlFor="share_anyone"
									className={styles['checkbox-label']}
								>
									<input
										type="checkbox"
										name="share_anyone"
										id="share_anyone"
										className={styles.checkbox}
										onChange={handlePublicFile}
										checked={isPublic}
									/>
									<div className={styles['checkbox-wrap']}>
										<span
											className={`${icon} ${styles.check} ${isPublic ? styles['is-check'] : ''}`}
										/>
									</div>
									Anyone with the link
								</label>
							</div>
							<div
								className={classes({
									'form-message-wrap': true,
									'form-message-active': inputErrors.username,
								})}
							>
								<span className={`${icon} ${formStyles.alert}`} />
								<p className={formStyles['form-message']}>
									{inputErrors.username
										? inputErrors.username
										: 'Message Placeholder'}
								</p>
							</div>
							<div className={styles['submit-wrap']}>
								{isPublic && (
									<button
										type="button"
										className={styles['copy-button']}
										onClick={handleCopyLink}
									>
										Copy Link
									</button>
								)}
								{isDataChange ? (
									<button type="submit" className={formStyles['form-submit']}>
										Save
									</button>
								) : (
									<button
										type="button"
										className={formStyles['form-submit']}
										onClick={() => onActiveModal({ component: null })}
									>
										Done
									</button>
								)}
							</div>
						</form>
					</div>
				</>
			)}
		</>
	);
};

File_Share.propTypes = {
	name: PropTypes.string,
	sharers: PropTypes.array,
	publicId: PropTypes.string,
	folderId: PropTypes.string,
	fileId: PropTypes.string,
	onGetFolder: PropTypes.func,
	onActiveModal: PropTypes.func,
};
