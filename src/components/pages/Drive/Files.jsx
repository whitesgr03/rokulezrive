import { useOutletContext } from 'react-router-dom';

import { List } from './List';

export const Files = () => {
  const { files, menu, onActiveMenu } = useOutletContext();
  
	return (
		<>
			<h3>Files</h3>
			<List
				data={files}
				type={'files'}
				onActiveMenu={onActiveMenu}
				menu={menu}
			/>
		</>
	);
};
