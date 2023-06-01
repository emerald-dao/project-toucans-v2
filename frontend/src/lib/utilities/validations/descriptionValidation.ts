import { enforce, omitWhen, test } from 'vest';

export const descriptionValidation = (descriptionData: string) => {
	test('description', 'Description is needed', () => {
		enforce(descriptionData).isNotBlank();
	});

	test('description', 'Description should be longer than 14 chars', () => {
		enforce(descriptionData).longerThan(14);
	});

	test('description', 'Description should be shorter than 320 chars', () => {
		enforce(descriptionData).shorterThan(320);
	});
};

export const longDescriptionValidation = (longDescriptionData: string) => {
	omitWhen(longDescriptionData === '', () => {
		test('longDescription', 'Long description should be longer than 320 chars', () => {
			enforce(longDescriptionData).longerThan(320);
		});

		test('longDescription', 'Long description should be shorter than 1400 chars', () => {
			enforce(longDescriptionData).shorterThan(1400);
		});
	});
};
