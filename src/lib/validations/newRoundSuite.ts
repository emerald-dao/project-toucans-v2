import { create, enforce, test, only } from 'vest';

const newRoundSuite = create((data = {}, currentField) => {
	only(currentField);

	console.log(currentField);

	test('fundingGoal', 'Funding goal must be greater tha 0', () => {
		enforce(data.fundingGoal).greaterThan(0);
	});

	test('startDate', 'Start date must be equal or greater than today', () => {
		console.log('aa');

		enforce(new Date(data.startDate).getTime()).greaterThanOrEquals(new Date().getTime());
	});

	test('endDate', 'End date must be greater than start date', () => {
		console.log('bb');
		enforce(new Date(data.endDate).getTime()).greaterThan(new Date(data.startDate).getTime());
	});
});

export default newRoundSuite;
