import { useOutletContext } from 'react-router-dom';

import { List } from './List';

export const Files = () => {
	const { files, activeOptionList } = useOutletContext();
	return (
		<>
			<h3>Files</h3>
			<List data={files} type={'files'} activeOptionList={activeOptionList} />
		</>
	);
};
