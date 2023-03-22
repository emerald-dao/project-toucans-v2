import { enforce, test } from 'vest';

export const websiteValidations = (websiteData: string) => {
	test('website', 'Must be a valid URL', () => {
		if (websiteData.length > 0) {
			enforce(websiteData).matches(/^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/);
		}
	});
};

export const twitterValidations = (twitterData: string) => {
	test('twitter', 'Must start with @', () => {
		if (twitterData.length > 0) {
			enforce(twitterData).matches(/^@/);
		}
	});

	test('twitter', 'Must be longer than 3 chars', () => {
		if (twitterData.length > 0) {
			enforce(twitterData).longerThan(3);
		}
	});
};

export const discordValidations = (discordData: string) => {
	test('discord', 'Must be a valid discord link', () => {
		if (discordData.length > 0 || discordData == 'https://discord.gg/') {
			enforce(discordData).matches(/^https:\/\/(discord\.(gg|com)\/)/i);
		}
	});

	test('discord', 'Must be longer than 22 chars', () => {
		if (discordData.length > 0 || discordData == 'https://discord.gg/') {
			enforce(discordData).longerThan(22);
		}
	});
};
