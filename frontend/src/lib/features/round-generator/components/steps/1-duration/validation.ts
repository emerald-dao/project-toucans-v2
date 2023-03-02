import { create, enforce, test, only, omitWhen } from 'vest';

const validationSuite = create((data = {}, currentField) => {
	only(currentField);

	test('startDate', 'Start date must be equal to or greater than 5 minutes from now.', () => {
		enforce(new Date(data.startDate).getTime() - 300000).greaterThanOrEquals(new Date().getTime());
	});

	omitWhen(data.infiniteDuration, () => {
		test('endDate', 'End date must be greater than start date', () => {
			enforce(new Date(data.endDate).getTime()).greaterThan(new Date(data.startDate).getTime());
		});
	});
});

export default validationSuite;
