// Packages
import classNames from 'classnames/bind';
import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import PropTypes from 'prop-types';

// Styles
import styles from './File_Upload.module.css';
import { icon } from '../../../styles/icon.module.css';
import formStyles from '../../../styles/form.module.css';

// Components
import { Loading } from '../../utils/Loading/Loading';

// Utils
import { handleFetch } from '../../../utils/handle_fetch';
import { formatBytes } from '../../../utils/format_bytes';

// Variables
const classes = classNames.bind(formStyles);

export const File_Upload = ({ folderId, onGetFolder, onActiveModal }) => {
	const [inputError, setInputError] = useState('');
	const [file, setFile] = useState({});
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);

	const handleCancel = () => {
		setFile({});
		setInputError('');
	};

	const handleChange = e => {
		const file = e.target.files[0];
		const MEGABYTE = 1000000;

		file.size <= MEGABYTE
			? setFile(file)
			: setInputError('Size must be less than 1 MB.');
	};

	const handleUploadFile = async () => {
		setLoading(true);

		const url = `${import.meta.env.VITE_RESOURCE_URL}/api/folders/${folderId}/files`;

		const formData = new FormData();

		formData.append('file', file);

		const options = {
			method: 'POST',
			body: formData,
			credentials: 'include',
		};

		const result = await handleFetch(url, options);

		const handleSuccess = () => {
			onGetFolder(folderId);
			onActiveModal({ component: null });
		};

		result.success ? handleSuccess() : setError(result.message);
		setLoading(false);
	};

	const handleSubmit = async e => {
		e.preventDefault();

		file instanceof File && (await handleUploadFile());
	};

	return (
		<>
			{error ? (
				<Navigate to="/error" state={{ error }} />
			) : (
				<>
					{loading && (
						<Loading text={'Uploading...'} light={true} shadow={true} />
					)}
					<div className={styles.upload}>
						<h3>Upload File</h3>
						<form
							className={`${formStyles.form} ${styles['upload-form']}`}
							onSubmit={handleSubmit}
						>
							<div
								className={`${formStyles['form-wrap']} ${styles['upload-form-wrap']}`}
							>
								{file instanceof File ? (
									<>
										<div className={styles.file}>
											<button
												type="button"
												className={styles['file-button']}
												onClick={handleCancel}
											>
												<span className={`${icon} ${styles.restart}`} />
											</button>
											<span
												className={`${icon} ${styles['file-icon']} ${styles.image}`}
											/>
										</div>
										<div className={styles['file-info']}>
											<p>{file.name}</p>
											<p>{formatBytes(file.size)}</p>
										</div>
										<button type="submit" className={formStyles['form-submit']}>
											Upload
										</button>
									</>
								) : (
									<>
										<label
											htmlFor="upload"
											className={formStyles['form-label']}
										>
											<input
												type="file"
												id="upload"
												className={`${classes({
													'form-input': true,
													'form-input-bgc': true,
													'form-input-error': inputError,
												})}`}
												name="upload"
												title="size must be less than 1 mb."
												onChange={handleChange}
											/>
											<div className={styles.preview}>
												<span className={`${icon} ${styles['upload-file']}`} />
												<p>Click here to upload</p>
												<p>( File as you like up to 1 MB )</p>
											</div>
										</label>
										<div
											className={classes({
												'form-message-wrap': true,
												'form-message-active': inputError,
											})}
										>
											<span className={`${icon} ${formStyles.alert}`} />
											<p className={formStyles['form-message']}>
												{inputError ? inputError : 'Message Placeholder'}
											</p>
										</div>
									</>
								)}
							</div>
						</form>
					</div>
				</>
			)}
		</>
	);
};

File_Upload.propTypes = {
	folderId: PropTypes.string,
	onGetFolder: PropTypes.func,
	onActiveModal: PropTypes.func,
};
