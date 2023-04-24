import { create, enforce, test } from 'vest';

export const transferOverflowSuite = create((data = '', amountToGoal, overflowBalance) => {
	test(`transferOverflowAmount`, 'Transfer amount should be greater than 0', () => {
		enforce(data).greaterThan(0);
	});

	test(
		`transferOverflowAmount`,
		'Transfer amount should be less than or equal to the amount in overflow',
		() => {
			enforce(data).lessThanOrEquals(overflowBalance);
		}
	);

	test(
		`transferOverflowAmount`,
		'Transfer amount should be less than or equal to the amount needed to reach the goal',
		() => {
			enforce(data).lessThanOrEquals(amountToGoal);
		}
	);
});
