import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import PropTypes from 'prop-types';

import driveStyles from '../Drive.module.css';
import { icon } from '../../../../styles/icon.module.css';
import styles from './Files.module.css';

// Components
import { File_Update } from '../File_Update';
import { File_Delete } from '../File_Delete';
import { File_Share } from '../File_Share';

export const Files = ({ data, menu, onActiveMenu, onActiveModal }) => {
	return (
		<>
			<h3>Files</h3>
			<ul className={driveStyles.list}>
				{data.map(file => (
					<li key={file.id} className={driveStyles.item}>
						<Link
							to={`/files/${file.id}`}
							relative="path"
							className={driveStyles.container}
						>
							<span className={`${icon} ${driveStyles.image}`} />
							<div className={driveStyles.content}>
								<p className={driveStyles.name}>{file.name}</p>
								<div className={driveStyles['info-wrap']}>
									<div className={driveStyles.info}>
										<span className={`${icon} ${styles.size}`} />
										<span className={driveStyles['file-content']}>
											{file.size}
										</span>
									</div>

									<div className={driveStyles.info}>
										<span className={`${icon} ${driveStyles.calendar}`} />
										<span className={driveStyles.date}>
											{format(file.createdAt, 'MMM d, y')}
										</span>
									</div>
								</div>
							</div>
						</Link>
						<div className={driveStyles.options}>
							<button
								onClick={() =>
									onActiveMenu({
										id: file.id,
										button: 'option-button',
										name: 'option-menu',
									})
								}
								data-id={file.id}
								data-button="option-button"
							>
								<span className={`${icon} ${driveStyles.option}`} />
							</button>
							{menu.name === 'option-menu' && menu.id === file.id && (
								<ul className={`option-menu ${driveStyles['option-menu']}`}>
									<>
										<li>
											<button
												type="button"
												className={driveStyles['option-menu-button']}
												onClick={() =>
													onActiveModal(<File_Share name={file.name} />)
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
									</>

									<li>
										<button
											type="button"
											className={driveStyles['option-menu-button']}
											onClick={() =>
												onActiveModal(<File_Update name={file.name} />)
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
												onActiveModal(<File_Delete name={file.name} />)
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

Files.propTypes = {
	data: PropTypes.array,
	menu: PropTypes.object,
	onActiveMenu: PropTypes.func,
	onActiveModal: PropTypes.func,
};
