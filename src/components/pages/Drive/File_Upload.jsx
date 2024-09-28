// Packages
import classNames from 'classnames/bind';

// Styles
import styles from './File_Upload.module.css';
import { icon } from '../../../styles/icon.module.css';
import formStyles from '../../../styles/form.module.css';

// Variables
const classes = classNames.bind(formStyles);

export const File_Upload = () => {
	const upload = false;
	const error = '';
	return (
		<div className={styles.upload}>
			<h3>Upload File</h3>

			<form className={`${formStyles.form} ${styles['upload-form']}`}>
				<div
					className={`${formStyles['form-wrap']} ${styles['upload-form-wrap']}`}
				>
					{upload ? (
						<>
							<div className={styles.file}>
								<button type="button" className={styles['file-button']}>
									<span className={`${icon} ${styles.restart}`} />
								</button>
								<span
									className={`${icon} ${styles['file-icon']} ${styles.image}`}
								/>
							</div>
							<div className={styles['file-info']}>
								<p>File name</p>
								<p>50 KB</p>
							</div>
						</>
					) : (
						<>
							<label htmlFor="upload" className={formStyles['form-label']}>
								<input
									type="file"
									id="upload"
									className={`${classes({
										'form-input': true,
										'form-input-bgc': true,
										'form-input-error': error,
									})}`}
									name="upload"
									title="The file is required, size must be less than 1 mb."
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
									'form-message-active': error,
								})}
							>
								<span className={`${icon} ${formStyles.alert}`} />
								<p className={formStyles['form-message']}>
									{error ? error : 'Message Placeholder'}
								</p>
							</div>
						</>
					)}
				</div>
				{upload && (
					<button type="submit" className={formStyles['form-submit']}>
						Upload
					</button>
				)}
			</form>
		</div>
	);
};
