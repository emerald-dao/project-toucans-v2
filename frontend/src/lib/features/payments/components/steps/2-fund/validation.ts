import { create, enforce, test, only, skipWhen } from 'vest';
import { isPositiveInteger } from '$lib/utilities/validations/isPositiveIntegerValidation';

enforce.extend({ isPositiveInteger });

const validationSuite = create((data = {}, currentField) => {
	only(currentField);

	test('amount', 'Amount should be greater than 0', () => {
		enforce(data.amount).greaterThan(0);
	});

	skipWhen(
		data.projectId != 'BallerzFC',
		() => {
			test('amount', 'Amount must be a positive integer', () => {
				enforce(data.amount).isPositiveInteger();
			})
		}
	)
});

export default validationSuite;
