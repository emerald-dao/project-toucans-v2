import { create, enforce, test, only } from 'vest';

const roundDistributionSuite = create((data = {}, currentField) => {
	only(currentField);

	test('address', 'Address must be 18 chars long', () => {
		enforce(data.address).lengthEquals(18);
	});

	test('percentage', 'Address must be 18 chars long', () => {
		enforce(data.percentage).greaterThan(0);
	});
});

export default roundDistributionSuite;
