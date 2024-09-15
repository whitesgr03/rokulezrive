import { useOutletContext } from 'react-router-dom';

import { List } from './List';

export const Shared = () => {
	const { shared, activeOptionList } = useOutletContext();
	return (
		<>
			<h3>Shared</h3>
			<List data={shared} type={'shared'} activeOptionList={activeOptionList} />
		</>
	);
};
