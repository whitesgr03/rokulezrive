// Packages
import { Outlet, useOutletContext, useMatch } from 'react-router-dom';
import { useState } from 'react';

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
	const { user } = useOutletContext();
	const [activeOptionList, setActiveOptionList] = useState('');
	const [activeUploadList, setActiveUploadList] = useState(false);
	const files = filesDefault;
	const shared = sharedDefault;

	const drivePath = useMatch('/drive');

	const handleActiveOptionList = e => {
		const options = e.target.closest('.options');
		const optionList = e.target.closest('.option-list');
		const upload = e.target.closest('.upload');
		const uploadList = e.target.closest('upload-list');

		optionList || (options && activeOptionList !== options.dataset.id)
			? setActiveOptionList(options.dataset.id)
			: setActiveOptionList('');

		uploadList || (upload && !activeUploadList)
			? setActiveUploadList(true)
			: setActiveUploadList(false);
	};

	return (
		<div className={styles.drive} onClick={handleActiveOptionList}>
			{drivePath && <h2>My Drive</h2>}
			<div className={styles.container}>
				<Outlet context={{ files, shared, activeOptionList }} />
			</div>
		</div>
	);
};
