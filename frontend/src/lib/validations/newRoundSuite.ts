import { create, enforce, test, only } from 'vest';

const newRoundSuite = create((data = {}, currentField) => {
	only(currentField);

	test('fundingGoal', 'Funding goal must be greater than 0', () => {
		enforce(data.fundingGoal).greaterThan(0);
	});

	test('startDate', 'Start date must be equal to or greater than 5 minutes from now.', () => {
		enforce(new Date(data.startDate).getTime() - 300000).greaterThanOrEquals(new Date().getTime());
	});

	test('endDate', 'End date must be greater than start date', () => {
		enforce(new Date(data.endDate).getTime()).greaterThan(new Date(data.startDate).getTime());
	});

	test('issuanceRate', 'Issuance rate is needed', () => {
		enforce(data.issuanceRate).isNotEmpty();
	});

	test('issuanceRate', 'Issuance rate must be greater than 0', () => {
		enforce(data.issuanceRate).greaterThan(0);
	});
});

export default newRoundSuite;
