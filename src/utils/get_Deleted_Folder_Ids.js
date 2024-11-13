export const getDeletedFolderIds = (arrFolder, folders, result) =>
	arrFolder.length
		? getDeletedFolderIds(
				arrFolder.reduce(
					(previousFolder, currentFolder) => [
						...previousFolder,
						...folders.splice(
							folders.findIndex(folder => folder.id === currentFolder.id),
							1,
						)[0].subfolders,
					],
					[],
				),
				folders,
				[...result, ...arrFolder],
			)
		: result;
