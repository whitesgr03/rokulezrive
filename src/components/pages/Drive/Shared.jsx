// Packages
import { useOutletContext, Link } from 'react-router-dom';
import { format } from 'date-fns';

// Styles
import driveStyles from './Drive.module.css';
import { icon } from '../../../styles/icon.module.css';
import styles from './Shared.module.css';

// Components
import { File_Delete } from './File_Delete';

export const Shared = () => {
	const { shared, menu, onActiveMenu, onActiveModal } = useOutletContext();

	return (
		<>
			<h3>Shared</h3>
			<ul className={driveStyles.list}>
				{shared.map(item => (
					<li key={item.id} className={driveStyles.item}>
						<Link
							to={`/drive/shared/${item.id}`}
							state={{ file: item }}
							className={driveStyles.container}
						>
							<span className={`${icon} ${driveStyles[item.type]}`} />
							<div className={driveStyles.content}>
								<p className={driveStyles.name}>{item.name}</p>
								<div className={driveStyles['info-wrap']}>
									<div className={driveStyles.info}>
										<span className={`${icon} ${styles['share-by']}`} />
										<span className={driveStyles['file-content']}>
											{item.owner}
										</span>
									</div>
									<div className={driveStyles.info}>
										<span className={`${icon} ${driveStyles.calendar}`} />
										<span>{format(item.createdAt, 'MMM d, y')}</span>
									</div>
								</div>
							</div>
						</Link>
						<div className={driveStyles.options}>
							<button
								onClick={() =>
									onActiveMenu({
										id: item.id,
										button: 'option-button',
										name: 'option-menu',
									})
								}
								data-id={item.id}
								data-button="option-button"
							>
								<span className={`${icon} ${driveStyles.option}`} />
							</button>
							{menu.name === 'option-menu' && menu.id === item.id && (
								<ul className={`option-menu ${driveStyles['option-menu']}`}>
									<li>
										<button
											type="button"
											className={driveStyles['option-menu-button']}
										>
											<span className={`${icon} ${driveStyles.download}`} />
											Download
										</button>
									</li>
									<li>
										<button
											type="button"
											className={driveStyles['option-menu-button']}
											onClick={() =>
												onActiveModal(<File_Delete name={item.name} />)
											}
										>
											<span className={`${icon} ${driveStyles.delete}`} />
											Remove
										</button>
									</li>
								</ul>
							)}
						</div>
					</li>
				))}
			</ul>
		</>
	);
};
