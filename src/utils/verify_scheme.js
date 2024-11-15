export const verifyScheme = async (formData, schema) => {
	let result = {
		success: true,
	};

	try {
		await schema.validate(formData, {
			abortEarly: false,
			stripUnknown: true,
		});
	} catch (err) {
		for (const error of err.inner) {
			result.fields[error.path] ?? (result.fields[error.path] = error.message);
		}
		result.success = false;
	}

	return result;
};
