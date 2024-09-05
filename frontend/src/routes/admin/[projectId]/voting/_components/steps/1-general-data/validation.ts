import { create, enforce, test } from 'vest';
import { DESCRIPTION_MAX_LENGTH, TITLE_MAX_LENGTH } from '../../../_config/votingGeneratorConfig';

const validationSuite = create((title: string, description: string) => {
	test('title', 'Your votation needs a title!', () => {
		enforce(title).isNotBlank();
	});

	test('title', 'Your votation title is too long!', () => {
		enforce(title).shorterThanOrEquals(TITLE_MAX_LENGTH);
	});

	test('description', 'Your votation description is too long!', () => {
		enforce(description).shorterThanOrEquals(DESCRIPTION_MAX_LENGTH);
	});
});

export const reset = validationSuite.reset;

export default validationSuite;
