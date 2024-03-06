import { create, enforce, test } from 'vest';

const validationSuite = create((startDate: string, endDate: string) => {
	test('startDate', 'Your votation needs a start date!', () => {
		enforce(startDate).isNotBlank();
	});

	test('endDate', 'Your votation needs an end date!', () => {
		enforce(endDate).isNotBlank();
	});

	test('endDate', 'Your votation end date must be after the start date!', () => {
		enforce(endDate).isAfter(startDate);
	});
});

export default validationSuite;
