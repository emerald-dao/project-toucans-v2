import { create, enforce, only, test } from 'vest';
import { DESCRIPTION_MAX_LENGTH, TITLE_MAX_LENGTH } from '../config';

const validationSuite = create((title: string, description: string, currentField) => {
	only(currentField);

	test('title', 'Your votation needs a title!', () => {
		enforce(title).isNotBlank();
	});

	test('title', 'Your votation title is too long!', () => {
		enforce(title).shorterThanOrEquals(TITLE_MAX_LENGTH);
	});

	test('description', 'Your votation needs a description!', () => {
		enforce(description).isNotBlank();
	});

	test('description', 'Your votation description is too long!', () => {
		enforce(description).shorterThanOrEquals(DESCRIPTION_MAX_LENGTH);
	});
});

export default validationSuite;
