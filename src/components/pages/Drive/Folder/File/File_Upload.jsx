// Packages
import classNames from 'classnames/bind';
import { useState } from 'react';
import { useMatch, useNavigate, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import { supabase } from '../../../../../utils/supabase_client';

// Styles
import driveStyles from '../../Drive.module.css';
import { icon } from '../../../../../styles/icon.module.css';
import formStyles from '../../../../../styles/form.module.css';

// Components
import { Loading } from '../../../../utils/Loading/Loading';

// Utils
import { handleFetch } from '../../../../../utils/handle_fetch';
import { formatBytes } from '../../../../../utils/format_bytes';

// Variables
const classes = classNames.bind(formStyles);

export const FileUpload = ({ folderId, onUpdateFolder, onActiveModal }) => {
	const [inputError, setInputError] = useState('');
	const [file, setFile] = useState({});
	const [size, setSize] = useState(0);
	const [loading, setLoading] = useState(false);

	const { pathname: previousPath } = useLocation();
	const navigate = useNavigate();

	const uploadFileFromShared_File = useMatch('/drive/shared/:id');
	const uploadFileFromFile_Info = useMatch('/drive/files/:id');

	const uploadFileFromSubfolderShared_File = useMatch(
		'/drive/folders/:id/shared/:id',
	);
	const uploadFileFromSubfolderFile_Info = useMatch(
		'/drive/folders/:id/files/:id',
	);

	const handleReset = () => {
		setFile({});
		setInputError('');
	};

	const handlePreview = e => {
		const file = e.target.files[0];
		const MEGABYTE = 1000000;

		const handleError = () => {
			setInputError('Size must be less than 1 MB.');
			setSize(file.size);
		};
		file.size <= MEGABYTE ? setFile(file) : handleError();
	};

	const handleUploadFile = async () => {
		const {
			data: {
				session: { access_token },
			},
		} = await supabase.auth.getSession();

		const url = `${import.meta.env.VITE_RESOURCE_URL}/api/folders/${folderId}/files`;

		const formData = new FormData();

		formData.append('file', file);

		const options = {
			method: 'POST',
			body: formData,
			headers: {
				Authorization: `Bearer ${access_token}`,
			},
		};

		const result = await handleFetch(url, options);

		const handleSuccess = () => {
			onUpdateFolder(result.data);
			(uploadFileFromShared_File || uploadFileFromFile_Info) &&
				navigate('/drive');
			(uploadFileFromSubfolderShared_File ||
				uploadFileFromSubfolderFile_Info) &&
				navigate(`/drive/folders/${folderId}`);
		};

		result.success
			? handleSuccess()
			: navigate('/drive/error', {
					state: { error: result.message, previousPath },
				});

		onActiveModal({ component: null });
	};

	const handleSubmit = async e => {
		e.preventDefault();

		setLoading(true);

		file instanceof File && (await handleUploadFile());

		setLoading(false);
	};

	return (
		<>
			{loading && <Loading text={'Uploading...'} light={true} shadow={true} />}
			<div className={driveStyles.upload}>
				<h3>Upload File</h3>
				<form
					className={`${formStyles.form} ${driveStyles['upload-form']}`}
					onSubmit={e => !loading && handleSubmit(e)}
				>
					<div
						className={`${formStyles['form-wrap']} ${driveStyles['upload-form-wrap']}`}
					>
						{file instanceof File ? (
							<>
								<div className={driveStyles.file}>
									<button
										type="button"
										className={driveStyles['restart-button']}
										onClick={handleReset}
										title="Reset button"
									>
										<span className={`${icon} ${driveStyles.restart}`} />
									</button>
									<span
										className={`${icon} ${driveStyles['file-icon']} ${driveStyles.image}`}
									/>
								</div>
								<div className={driveStyles['file-info']}>
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
									className={`${formStyles['form-label']} ${driveStyles.preview}`}
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
										title="upload"
										onChange={handlePreview}
									/>
									<span className={`${icon} ${driveStyles['upload-file']}`} />
									<p>Click here to upload</p>
									<p>( File as you like up to 1 MB )</p>
								</label>
								<div
									className={classes({
										'form-message-wrap': true,
										'form-message-active': inputError,
									})}
									data-testid="upload-message"
								>
									<span className={`${icon} ${formStyles.alert}`} />
									<div>
										<p>The upload file size: {size && formatBytes(size)}.</p>
										<p className={formStyles['form-message']}>
											{inputError ? inputError : 'Message Placeholder'}
										</p>
									</div>
								</div>
							</>
						)}
					</div>
				</form>
			</div>
		</>
	);
};

FileUpload.propTypes = {
	folderId: PropTypes.string,
	onUpdateFolder: PropTypes.func,
	onActiveModal: PropTypes.func,
};
