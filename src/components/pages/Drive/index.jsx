// Packages
import { Outlet, useOutletContext, useMatch } from 'react-router-dom';

// Styles
import styles from './Drive.module.css';

const filesDefault = [
	{
		id: '0',
		name: 'first project',
		size: '50 kb',
		type: 'image',
		createdAt: new Date(),
	},
	{
		id: '221',
		name: 'new Folder',
		createdAt: new Date(),
	},
	{
		id: '1',
		name: 'second project',
		size: '130 kb',
		type: 'pdf',
		createdAt: new Date(),
	},
	{
		id: '11',
		name: 'second project',
		size: '130 kb',
		type: 'pdf',
		createdAt: new Date(),
	},
	{
		id: '22',
		name: 'second project',
		size: '130 kb',
		type: 'pdf',
		createdAt: new Date(),
	},
];

const sharedDefault = [
	{
		id: '3',
		name: 'first shared file',
		owner: 'facebook@gmail.com',
		type: 'pdf',
		createdAt: new Date(),
	},
	{
		id: '4',
		name: 'second shared file',
		owner: 'google@gmail.com',
		type: 'image',
		createdAt: new Date(),
	},
	{
		id: '8',
		name: 'second shared file',
		owner: 'google@gmail.com',
		type: 'image',
		createdAt: new Date(),
	},
	{
		id: '10',
		name: 'second shared file',
		owner: 'google@gmail.com',
		type: 'image',
		createdAt: new Date(),
	},
];

export const Drive = () => {
	const { onActiveMenu, onActiveModal, menu } = useOutletContext();

	const files = filesDefault;
	const shared = sharedDefault;

	const drivePath = useMatch('/drive');

	return (
		<div className={styles.drive}>
			{drivePath && <h2>My Drive</h2>}
			<div className={styles.container}>
				<Outlet
					context={{ files, shared, onActiveMenu, onActiveModal, menu }}
				/>
			</div>
		</div>
	);
};
