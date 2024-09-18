// Packages
import { useOutletContext } from 'react-router-dom';
import { format } from 'date-fns';

// Styles
import driveStyles from './Drive.module.css';
import listStyles from './List.module.css';
import { icon } from '../../../styles/icon.module.css';

// Components
import { File_Update } from './File_Update';
import { File_Delete } from './File_Delete';
import { File_Share } from './File_Share';

export const Files = () => {
	const { files, menu, onActiveMenu, onActiveModal } = useOutletContext();

	return (
		<>
			<h3>Files</h3>
			<ul className={listStyles.list}>
				{files.map(item => (
					<li key={item.id} className={listStyles.file}>
						<button className={listStyles['file-button']}>
							<span className={`${icon} ${listStyles[item.type]}`} />
							<div className={listStyles.container}>
								<p className={listStyles['file-name']}>{item.name}</p>
								<div className={listStyles.info}>
									<div className={listStyles['file-wrap']}>
										<span className={`${icon} ${listStyles.size}`} />
										<span className={listStyles['file-content']}>
											{item.size}
										</span>
									</div>
									<div className={listStyles['file-wrap']}>
										<span className={`${icon} ${listStyles.date}`} />
										<span className={listStyles['file-content']}>
											{format(item.createdAt, 'MMM d, y')}
										</span>
									</div>
								</div>
							</div>
						</button>
						<div className={listStyles.options}>
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
								<span className={`${icon} ${listStyles.option}`} />
							</button>
							{menu.name === 'option-menu' && menu.id === item.id && (
								<ul className={`option-menu ${driveStyles['option-menu']}`}>
									<li>
										<button
											type="button"
											className={driveStyles['option-menu-button']}
											onClick={() =>
												onActiveModal(<File_Share name={item.name} />)
											}
											data-close-menu
										>
											<span className={`${icon} ${driveStyles.share}`} />
											Share
										</button>
									</li>
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
												onActiveModal(<File_Update name={item.name} />)
											}
											data-close-menu
										>
											<span className={`${icon} ${driveStyles.edit}`} />
											Rename
										</button>
									</li>
									<li>
										<button
											type="button"
											className={driveStyles['option-menu-button']}
											onClick={() =>
												onActiveModal(<File_Delete name={item.name} />)
											}
											data-close-menu
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
