export const distributionCsvValidation = async (files: File[] | FileList): Promise<true> => {
	return new Promise((resolve, reject) => {
		if (files.length > 1) {
			reject(['Too many files']);
		} else if (files[0].type != 'text/csv') {
			reject(['Wrong file type']);
		} else {
			resolve(true);
		}
	});
};
