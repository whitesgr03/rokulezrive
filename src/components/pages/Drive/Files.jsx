// Packages
import { useOutletContext, Link, useParams } from 'react-router-dom';
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

	const { folderId } = useParams();

	const defaultFiles = [
		{
			id: '0',
			name: 'fiewr111rst rewrr',
			size: '50 kb',
			type: 'image',
			createdAt: new Date(),
		},
		{
			id: '225',
			name: 'new Folder',
			createdAt: new Date(),
		},
		{
			id: '1',
			name: 'dsadsad project',
			size: '130 kb',
			type: 'pdf',
			createdAt: new Date(),
		},
		{
			id: '11',
			name: 'erwerew project',
			size: '130 kb',
			type: 'pdf',
			createdAt: new Date(),
		},
		{
			id: '22',
			name: 'dsd dsad',
			size: '130 kb',
			type: 'pdf',
			createdAt: new Date(),
		},
	];

	const data = folderId ? defaultFiles : files;

	return (
		<>
			<h3>Files</h3>
			<ul className={listStyles.list}>
				{data.map(item => (
					<li key={item.id} className={listStyles.file}>
						<Link
							to={
								item.type
									? `/drive/files/${item.id}`
									: `/drive/files/d/${item.id}`
							}
							state={{ file: item }}
							className={listStyles['file-button']}
						>
							{item.type ? (
								<span className={`${icon} ${listStyles[item.type]}`} />
							) : (
								<span className={`${icon} ${listStyles.folder}`} />
							)}
							<div className={listStyles.container}>
								<p className={listStyles['file-name']}>{item.name}</p>
								<div className={listStyles.info}>
									{item.type && (
										<div className={listStyles['file-wrap']}>
											<span className={`${icon} ${listStyles.size}`} />
											<span className={listStyles['file-content']}>
												{item.size}
											</span>
										</div>
									)}

									<div className={listStyles['file-wrap']}>
										<span className={`${icon} ${listStyles.date}`} />
										<span className={listStyles['file-content']}>
											{format(item.createdAt, 'MMM d, y')}
										</span>
									</div>
								</div>
							</div>
						</Link>
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
