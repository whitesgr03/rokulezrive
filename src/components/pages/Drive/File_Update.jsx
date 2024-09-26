// Packages
import classNames from 'classnames/bind';

// Styles
import { icon } from '../../../styles/icon.module.css';
import formStyles from '../../../styles/form.module.css';

// Variables
const classes = classNames.bind(formStyles);

export const File_Update = ({ name }) => {
  const fileName = name;
	const error = '';

	return (
		<form className={formStyles.form}>
			<div>
				<label htmlFor="file_rename" className={formStyles['form-label']}>
					Rename
					<input
						type="text"
						id="file_rename"
						className={`${classes({
							'form-input': true,
							'form-input-main-bgc': true,
							'form-input-error': error,
						})}`}
						name="file_rename"
						value={fileName}
						title="The file name is required."
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
				Save
			</button>
		</form>
	);
};
