export const createDownloadElement = (blob, name) => {
	const link = document.createElement('a');
	link.href = URL.createObjectURL(blob);
	link.download = name;
	return link;
};
