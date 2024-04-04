import { enforce, test } from 'vest';

export const nameValidation = (nameData: string) => {
	test('name', 'Name is needed', () => {
		enforce(nameData).isNotBlank();
	});

	test('name', 'Name should be longer than 4 chars', () => {
		enforce(nameData).longerThan(4);
	});

	test('name', 'Name should be shorter than 30 chars', () => {
		enforce(nameData).shorterThan(30);
	});
};
