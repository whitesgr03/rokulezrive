// Packages
import PropTypes from 'prop-types';
import { format } from 'date-fns';

// Styles
import styles from './List.module.css';
import { icon } from '../../../styles/icon.module.css';

export const List = ({ data, type, activeOptionList }) => {
	const options = {
		shared: [
			{
				class: styles.link,
				text: 'Copy link',
			},
			{
				class: styles.download,
				text: 'Download',
			},
			{
				class: styles.delete,
				text: 'Remove',
			},
		],
		files: [
			{
				class: styles.share,
				text: 'Share',
			},
			{
				class: styles.download,
				text: 'Download',
			},
			{
				class: styles.edit,
				text: 'Rename',
			},
			{
				class: styles.delete,
				text: 'Remove',
			},
		],
	};
	const optionList = options[type].map(option => (
		<li key={option.text}>
			<button type="button" className={styles['option-list-button']}>
				<span className={`${icon} ${option.class}`} />
				{option.text}
			</button>
		</li>
	));

	return (
		<ul className={styles.list}>
			{data.map(item => (
				<li key={item.id} className={styles.file}>
					<button className={styles['file-button']}>
						<span className={`${icon} ${styles[item.type]}`} />
						<div className={styles.container}>
							<p className={styles['file-name']}>{item.name}</p>
							<div className={styles.info}>
								<div className={styles['file-wrap']}>
									<span
										className={`${icon} ${type === 'files' ? styles.size : styles['share-by']}`}
									/>
									<span className={styles['file-content']}>
										{type === 'files' ? item.size : item.owner}
									</span>
								</div>
								<div className={styles['file-wrap']}>
									<span className={`${icon} ${styles.date}`} />
									<span className={styles['file-content']}>
										{format(item.createdAt, 'MMM d, y')}
									</span>
								</div>
							</div>
						</div>
					</button>
					<div className={`options ${styles.options}`} data-id={item.id}>
						<button>
							<span className={`${icon} ${styles.option}`} />
						</button>
						{activeOptionList === item.id && (
							<ul className={`option-list ${styles['option-list']}`}>
								{optionList}
							</ul>
						)}
					</div>
				</li>
			))}
		</ul>
	);
};

List.propTypes = {
	data: PropTypes.array,
	type: PropTypes.string,
	activeOptionList: PropTypes.string,
};
