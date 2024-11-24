export const handleFetch = async (url, option) => {
	try {
		const response = await fetch(url, { ...option });
		return await response.json();
	} catch (err) {
		return (
			!option.signal.aborted && {
				success: false,
				message: err,
			}
		);
	}
};

export const handleFetchBlob = async url => {
	try {
		const response = await fetch(url);
		return { success: true, blob: await response.blob() };
	} catch (err) {
		return {
			success: false,
			message: err,
		};
	}
};
