// Packages
import { Link } from 'react-router-dom';
import classNames from 'classnames/bind';

// Styles
import accountStyles from './Account.module.css';
import { icon } from '../../../styles/icon.module.css';
import formStyles from '../../../styles/form.module.css';

// Components
import { Account } from './index';

// Variables
const classes = classNames.bind(formStyles);

export const Register = () => {
	const errors = {};
	return (
		<Account title="User Sign Up">
			<form className={formStyles.form}>
				<div className={formStyles['input-wrap']}>
					<label htmlFor="email" className={formStyles['form-label']}>
						Email
						<input
							type="text"
							id="email"
							className={classes({
								'form-input': true,
								'form-input-error': errors.email,
							})}
							name="email"
							title="The email is required and must be standard format."
						/>
					</label>
					<div
						className={classes({
							'form-message-wrap': true,
							'form-message-active': errors.email,
						})}
					>
						<span className={`${icon} ${formStyles.alert}`} />
						<p className={formStyles['form-message']}>
							{errors.email ? errors.email : 'Message Placeholder'}
						</p>
					</div>
				</div>
				<div className={formStyles['input-wrap']}>
					<label htmlFor="password" className={formStyles['form-label']}>
						Password
						<input
							type="password"
							id="password"
							className={`${formStyles['form-input']} ${classes({
								'form-input-error': errors.password,
							})}`}
							name="password"
							title="The password is required."
						/>
					</label>
					<div
						className={classes({
							'form-message-wrap': true,
							'form-message-active': errors.password,
						})}
					>
						<span className={`${icon} ${formStyles.alert}`} />
						<p className={formStyles['form-message']}>
							{errors.password ? errors.password : 'Message Placeholder'}
						</p>
					</div>
				</div>
				<div className={formStyles['input-wrap']}>
					<label htmlFor="confirmPassword" className={formStyles['form-label']}>
						Confirm Password
						<input
							type="password"
							id="confirmPassword"
							className={`${formStyles['form-input']} ${classes({
								'form-input-error': errors.confirmPassword,
							})}`}
							name="confirmPassword"
							title="The confirm password must be the same as the password."
						/>
					</label>
					<div
						className={classes({
							'form-message-wrap': true,
							'form-message-active': errors.confirmPassword,
						})}
					>
						<span className={`${icon} ${formStyles.alert}`} />
						<p className={formStyles['form-message']}>
							{errors.confirmPassword
								? errors.confirmPassword
								: 'Message Placeholder'}
						</p>
					</div>
				</div>

				<button type="submit" className={formStyles['form-submit']}>
					Submit
				</button>
			</form>

			<div className={accountStyles['account-link-wrap']}>
				<p>Already have an account?</p>
				<Link className={accountStyles['account-link']} to="/account/login">
					Sign in account
				</Link>
			</div>
		</Account>
	);
};
