export const handleFetch = async (url, option) => {
	let result = null;
	try {
		const response = await fetch(url, { ...option });
		result = await response.json();
	} catch (err) {
		!option.signal.aborted &&
			(result = {
				success: false,
				message: err,
			});
	}
	return result;
};

export const handleFetchBlob = async url => {
	let result = null;
	try {
		const response = await fetch(url);
		result = { success: true, blob: await response.blob() };
	} catch (err) {
		result = {
			success: false,
			message: err,
		};
	}
	return result;
};
