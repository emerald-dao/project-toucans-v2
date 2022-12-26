import { create, enforce, test } from 'vest';

const roundDistributionSuite = create((data = {}) => {
	test('address', 'Address must be 18 chars long', () => {
		enforce(data.address).lengthEquals(18);
	});
});

export default roundDistributionSuite;
