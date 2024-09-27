// Packages
import classNames from 'classnames/bind';
import { useState } from 'react';

// Styles
import { icon } from '../../../styles/icon.module.css';
import formStyles from '../../../styles/form.module.css';
import styles from './File_Share.module.css';

// Variables
const classes = classNames.bind(formStyles);

export const File_Share = ({ name }) => {
	const [userEmail, setUserEmail] = useState(false);
	const error = '';
	// const error = 'The user has not been found';
	const emailList = [
		'facebook@gmail.com',
		'google@gmail.com',
		'xxxdd@gmail.com',
		'45y4@gmail.com',
	];
	// const emailList = [];
	return (
		<div className={styles['file-share']}>
			<h3>Share {`"${name}"`}</h3>
			<form className={formStyles.form}>
				<div>
					<div className={styles['input-wrap']}>
						{emailList.length > 0 && (
							<label htmlFor="user_email" className={` ${styles.label}`}>
								{emailList.map(email => (
									<div key={email} className={styles.email}>
										<span className={styles['email-text']}>{email}</span>
										<button type="button" className={styles['email-close']}>
											<span className={`${icon} ${styles.close}`} />
										</button>
									</div>
								))}
							</label>
						)}

						<div className={`${styles['button-wrap']} ${styles.border}`}>
							<input
								type="text"
								id="user_email"
								className={`${classes({
									'form-input': true,
									'form-input-modal-bgc': true,
									'form-input-error': error,
								})} ${styles.input}`}
								name="user_email"
								placeholder="Add people with email"
							/>
							<button type="button" className={styles['input-button']}>
								<span className={`${icon} ${styles.add}`} />
							</button>
						</div>
						<div className={styles['button-wrap']}>
							<label htmlFor="all_user" className={styles['checkbox-label']}>
								<input
									type="checkbox"
									name="all_user"
									id="all_user"
									className={styles.checkbox}
									onChange={e => setUserEmail(e.target.checked)}
								/>
								<div className={styles['checkbox-wrap']}>
									<span
										className={`${icon} ${styles.check} ${userEmail ? styles['is-check'] : ''}`}
									/>
								</div>
								Anyone with the link
							</label>
						</div>
					</div>
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

				<div className={styles['submit-wrap']}>
					{userEmail && (
						<button type="button" className={styles.copy}>
							Copy Link
						</button>
					)}

					<button type="submit" className={formStyles['form-submit']}>
						Done
					</button>
				</div>
			</form>
		</div>
	);
};
