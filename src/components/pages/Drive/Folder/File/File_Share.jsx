// Packages
import classNames from 'classnames/bind';
import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { object, string } from 'yup';
import { supabase } from '../../../../../utils/supabase_client';

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
}) => {
	const [newPublicId, setNewPublicId] = useState(publicId);
	const [isPublic, setIsPublic] = useState(publicId !== '');
	const [isCopied, setIsCopied] = useState(false);

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

		const {
			data: {
				session: { access_token },
			},
		} = await supabase.auth.getSession();

		const url = `${import.meta.env.VITE_RESOURCE_URL}/api/files/${fileId}/sharers`;

		const options = {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${access_token}`,
			},
			body: JSON.stringify(formData),
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

		const {
			data: {
				session: { access_token },
			},
		} = await supabase.auth.getSession();

		const url = `${import.meta.env.VITE_RESOURCE_URL}/api/files/${fileId}/sharers/${sharerId}`;

		const options = {
			method: 'DELETE',
			headers: {
				Authorization: `Bearer ${access_token}`,
			},
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

		const {
			data: {
				session: { access_token },
			},
		} = await supabase.auth.getSession();

		const setPublic = async () => {
			let url = `${import.meta.env.VITE_RESOURCE_URL}/api/files/${fileId}/public`;

			const options = {
				method: 'POST',
				headers: {
					Authorization: `Bearer ${access_token}`,
				},
			};

			return await handleFetch(url, options);
		};

		const setPrivate = async () => {
			let url = `${import.meta.env.VITE_RESOURCE_URL}/api/public/${newPublicId}`;

			const options = {
				method: 'DELETE',
				headers: {
					Authorization: `Bearer ${access_token}`,
				},
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
		!isCopied &&
			(await navigator.clipboard.writeText(
				`${location.protocol}//${location.host}/shared/${newPublicId}`,
			));
		!isCopied && setIsCopied(true);
	};

	const handleRemoveCopied = e => {
		e.target.dataset.copied &&
			setTimeout(() => {
				setIsCopied(false);
			}, 2000);
	};

	const listSharers = newSharers.map(item => {
		return (
			<li key={`${item.sharer.id}`} className={`${styles['username-item']} `}>
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
			</li>
		);
	});

	return (
		<>
			{error ? (
				<Navigate to="/error" state={{ error }} />
			) : (
				<>
					{loading && (
						<Loading text={'Sharing...'} light={true} shadow={true} />
					)}
					<div className={styles.container}>
						<h3>Share {`"${name}"`}</h3>
						<form className={formStyles.form} onSubmit={handleSubmit}>
							<div className={styles.wrap}>
								{newSharers.length > 0 && (
									<ul className={styles['username-list']}>{listSharers}</ul>
								)}

								<div className={styles['label-wrap']}>
									<label
										htmlFor="username"
										className={`${styles['label']} ${formStyles['form-label']}`}
									>
										Share people with username
									</label>
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
										<button
											type="submit"
											className={`${styles['input-button']} ${styles.zoom}`}
										>
											<span className={`${icon} ${styles.add}`} />
										</button>
									</div>
									{inputErrors.username && (
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
									)}
								</div>
								<div className={styles['checkbox-wrap']}>
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
										<div className={styles['checkbox-bgc']}>
											<div
												className={`${styles['checkbox-border']} ${isPublic ? styles['is-check-border'] : ''}`}
											>
												<span
													className={`${icon} ${styles.check} ${isPublic ? styles['is-check'] : ''}`}
												/>
											</div>
										</div>
										Anyone with the link
									</label>
									<button
										type="button"
										className={`${styles['copy-link']} ${styles['input-button']} ${isPublic ? '' : styles['show-btn']}`}
									>
										<div
											className={`${styles['copy-link-wrap']}  ${isCopied ? styles.copied : ''}`}
											data-copied
											onTransitionEnd={handleRemoveCopied}
										>
											<div className={styles['copy-link-item']}>
												<span
													className={`${icon} ${styles['copied-link-check']}`}
												/>
												<span className={styles['copied-link-text']}>
													Copied
												</span>
											</div>
											<div
												className={styles['copy-link-item']}
												onClick={isPublic ? handleCopyLink : () => {}}
											>
												<span className={`${icon} ${styles.link}`} />
											</div>
										</div>
									</button>
								</div>
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
