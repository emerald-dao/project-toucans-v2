import { create, enforce, test, only } from 'vest';

const validationSuite = create((data = {}, currentField) => {
	only(currentField);

	test('issuance-rate', 'Issuance rate should be greater or equal to 0', () => {
		enforce(data.issuanceRate).greaterThanOrEquals(0);
	});

	test('funding-target', 'Target should be greater or equal to 0', () => {
		enforce(data.fundingTarget).greaterThanOrEquals(0);
	});
});

export default validationSuite;
