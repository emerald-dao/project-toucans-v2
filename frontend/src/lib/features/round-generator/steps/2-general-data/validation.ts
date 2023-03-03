import { create, enforce, test, only, omitWhen } from 'vest';

const validationSuite = create((data = {}, currentField) => {
	only(currentField);

	omitWhen(data.infiniteFundingGoal, () => {
		test('fundingGoal', 'Funding goal must be greater than 0', () => {
			enforce(data.fundingGoal).greaterThan(0);
		});
	});

	test('issuanceRate', 'Issuance rate is needed', () => {
		enforce(data.issuanceRate).isNotEmpty();
	});

	test('issuanceRate', 'Issuance rate must be greater than 0', () => {
		enforce(data.issuanceRate).greaterThan(0);
	});
});

export default validationSuite;
