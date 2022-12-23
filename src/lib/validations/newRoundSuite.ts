import { create, enforce, test } from 'vest';

const newRoundSuite = create((data = {}) => {
	test('fundingGoal', 'Funding goal must be greater tha 0', () => {
		enforce(data.fundingGoal).greaterThan(0);
	});
});

export default newRoundSuite;
