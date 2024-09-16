// Packages
import classNames from 'classnames/bind';

// Styles
import { icon } from '../../../styles/icon.module.css';
import formStyles from '../../../styles/form.module.css';
import styles from './Folder_Form.module.css';

// Variables
const classes = classNames.bind(formStyles);

export const Folder_Form = () => {
	const error = '';

	return (
		<form className={formStyles.form}>
			<div className={formStyles['input-wrap']}>
				<label htmlFor="folder" className={formStyles['form-label']}>
					Folder Name
					<input
						type="text"
						id="folder"
						className={`${classes({
							'form-input': true,
							'form-input-error': error,
						})} ${styles['folder-form-input']}`}
						name="folder"
						title="The email is required and must be standard format."
					/>
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
			</div>

			<button type="submit" className={formStyles['form-submit']}>
				Create
			</button>
		</form>
	);
};
