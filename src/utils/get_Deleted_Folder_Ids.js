export const get_Deleted_Folder_Ids = (arrFolder, folders, result) =>
	arrFolder.length
		? get_Deleted_Folder_Ids(
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
