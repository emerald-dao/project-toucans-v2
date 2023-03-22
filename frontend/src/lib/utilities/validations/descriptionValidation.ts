import { enforce, test } from 'vest';

export const descriptionValidation = (descriptionData: string) => {
	test('description', 'Description is needed', () => {
		enforce(descriptionData).isNotBlank();
	});

	test('description', 'Description should be longer than 20 chars', () => {
		enforce(descriptionData).longerThan(20);
	});
};
