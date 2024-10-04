// Packages
import classNames from 'classnames/bind';
import { useState, useMemo } from 'react';
import { Navigate } from 'react-router-dom';
import PropTypes from 'prop-types';

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
	sharing,
	folderId,
	fileId,
	onGetFolder,
	onActiveModal,
}) => {
	const originUsernames = useMemo(
		() => sharing.members.map(item => item.member.username).sort(),
		[sharing.members],
	);

	const [shareAnyone, setShareAnyone] = useState(sharing.anyone);
	const [usernames, setUsernames] = useState(originUsernames);
	const [usernameErrors, setUsernameErrors] = useState([]);

	const [formData, setFormData] = useState({ username: '' });
	const [inputErrors, setInputErrors] = useState({});
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);

	const isDataChange =
		JSON.stringify(originUsernames) !== JSON.stringify([...usernames].sort()) ||
		sharing.anyone !== shareAnyone;

	const handleChange = e => {
		const { value, name } = e.target;

		const fields = {
			...formData,
			[name]: value,
		};
		setFormData(fields);
	};

	const handleAddUsername = () => {
		const handleSetUsername = () => {
			setUsernames([...usernames, formData.username]);
			setFormData({ ...formData, username: '' });
			setInputErrors({});
		};

		formData.username === ''
			? setInputErrors({ ...inputErrors, username: 'Username is required' })
			: handleSetUsername();
	};

	const handleRemoveUsernames = username => {
		const errors = usernameErrors.filter(u => u !== username);
		!errors.length && setInputErrors({});
		setUsernameErrors(errors);
		setUsernames(usernames.filter(u => u !== username));
	};

	const handleCreateSharing = async () => {
		setLoading(true);

		const url = `${import.meta.env.VITE_RESOURCE_URL}/api/files/${fileId}/sharing/${sharing.id}`;

		const options = {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ anyone: shareAnyone, usernames }),
			credentials: 'include',
		};

		const result = await handleFetch(url, options);

		const handleFail = () => {
			const handleMessageErrors = () => {
				setInputErrors({ ...inputErrors, ...result.fields });
				setUsernameErrors([...result.data]);
			};

			result.fields ? handleMessageErrors() : setError(result.message);
		};

		const handleSuccess = () => {
			onGetFolder(folderId);
			onActiveModal({ component: null });
		};

		result.success ? handleSuccess() : handleFail();
		setLoading(false);
	};

	const handleSubmit = async e => {
		e.preventDefault();
		!usernameErrors.length && (await handleCreateSharing());
	};

	const handleCopyLink = async () => {
		await navigator.clipboard.writeText(
			`${location.protocol}//${location.host}/shared/${sharing.id}`,
		);
	};

	const usernameList = usernames.map((name, index) => {
		const error = usernameErrors.find(err => err === name);

		return (
			<div
				key={`${name}${index}`}
				className={`${styles['username-item']} ${
					error ? styles['username-error'] : ''
				}`}
			>
				<span
					className={`${styles['username-text']} ${
						error ? styles['username-text-error'] : ''
					}`}
				>
					{name}
				</span>
				<button
					type="button"
					className={`${styles['username-close']} ${
						error ? styles['username-close-error'] : ''
					}`}
					onClick={() => handleRemoveUsernames(name)}
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
								{usernames.length > 0 && (
									<ul className={styles['username-list']}>{usernameList}</ul>
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
										<button
											type="button"
											className={styles['input-button']}
											onClick={handleAddUsername}
										>
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
										onChange={() => setShareAnyone(!shareAnyone)}
										checked={shareAnyone}
									/>
									<div className={styles['checkbox-wrap']}>
										<span
											className={`${icon} ${styles.check} ${shareAnyone ? styles['is-check'] : ''}`}
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
								{shareAnyone && (
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
	sharing: PropTypes.object,
	folderId: PropTypes.string,
	fileId: PropTypes.string,
	onGetFolder: PropTypes.func,
	onActiveModal: PropTypes.func,
};
