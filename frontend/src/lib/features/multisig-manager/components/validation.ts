import { create, enforce, test } from 'vest';

export const validationSuite = create((data = '', amountOfSignatures) => {
	test(`threshold`, 'Threshold is needed', () => {
		enforce(data).isNotEmpty();
	});

	test(`threshold`, 'Threshold should be greater than or equal to 1', () => {
		enforce(data).greaterThanOrEquals(1);
	});

	test(`threshold`, 'Threshold should be less than or equals to the amount of signatures', () => {
		enforce(data).lessThanOrEquals(amountOfSignatures);
	});
});
