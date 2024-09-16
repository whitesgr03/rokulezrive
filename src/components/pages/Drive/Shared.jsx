import { useOutletContext } from 'react-router-dom';

import { List } from './List';

export const Shared = () => {
	const { shared, menu, onActiveMenu } = useOutletContext();

	return (
		<>
			<h3>Shared</h3>
			<List
				data={shared}
				type={'shared'}
				onActiveMenu={onActiveMenu}
				menu={menu}
			/>
		</>
	);
};
