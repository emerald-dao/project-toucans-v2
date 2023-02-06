export const hyphenateAndLowerCase = (str: string) => {
	return str.replace(/ /g, '-').toLowerCase();
};
