import { create, enforce, test, only, optional } from 'vest';

const validationSuite = create((data = {}, currentField) => {
	only(currentField);

	optional(['website', 'discord', 'twitter']);

	test('website', 'Must be a valid URL', () => {
		if (data.website.length > 0) {
			enforce(data.website).matches(/^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/);
		}
	});

	test('twitter', 'Must start with @', () => {
		if (data.twitter.length > 0) {
			enforce(data.twitter).matches(/^@/);
		}
	});

	test('twitter', 'Must be longer than 3 chars', () => {
		if (data.twitter.length > 0) {
			enforce(data.twitter).longerThan(3);
		}
	});

	test('discord', 'Must be a valid discord link', () => {
		if (data.discord.length > 0 || data.discord == 'https://discord.gg/') {
			enforce(data.discord).matches(/^https:\/\/(discord\.(gg|com)\/)/i);
		}
	});

	test('discord', 'Must be longer than 22 chars', () => {
		if (data.discord.length > 0 || data.discord == 'https://discord.gg/') {
			enforce(data.discord).longerThan(22);
		}
	});
});

export default validationSuite;
