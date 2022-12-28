import { create, enforce, test, only } from 'vest';

const newRoundSuite = create((data = {}, currentField) => {
	only(currentField);

	test('fundingGoal', 'Funding goal must be greater tha 0', () => {
		enforce(data.fundingGoal).greaterThan(0);
	});

	test('startDate', 'Start date must be equal or greater than today', () => {
		enforce(new Date(data.startDate).getTime()).greaterThanOrEquals(new Date().getTime());
	});

	test('endDate', 'End date must be greater than start date', () => {
		enforce(new Date(data.endDate).getTime()).greaterThan(new Date(data.startDate).getTime());
	});
});

export default newRoundSuite;
