import { create, enforce, test, only } from 'vest';
import { isPositiveInteger } from '$lib/utilities/validations/isPositiveIntegerValidation';

enforce.extend({ isPositiveInteger });

const validationSuite = create((data = {}, currentField) => {
	only(currentField);

	test('amount', 'Amount should be greater than 0', () => {
		enforce(data.amount).greaterThan(0);
	});

	test('amount', 'Amount must be a positive integer', () => {
		if (data.projectId == 'BallerzFC') {
			enforce(data.amount).isPositiveInteger();
		}
	});

	// skipWhen(
	// 	data.projectId != 'BallerzFC',
	// 	() => {
	// 		test('amount', 'Amount must be a positive integer', () => {
	// 			enforce(data.amount).isPositiveInteger();
	// 		})
	// 	}
	// )
});

export default validationSuite;
