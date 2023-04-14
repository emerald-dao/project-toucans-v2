import { enforce, test } from 'vest';

export const websiteValidations = (websiteData: string) => {
	test('website', 'Must be a valid URL', () => {
		enforce(websiteData).matches(/^([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/);
	});
};

export const twitterValidations = (twitterData: string) => {
	test('twitter', 'Must be longer than 3 chars', () => {
		enforce(twitterData).longerThan(3);
	});
};

export const discordValidations = (discordData: string) => {
	test('discord', 'Must be shorter than 40 chars', () => {
		enforce(discordData).shorterThan(40);
	});
};
