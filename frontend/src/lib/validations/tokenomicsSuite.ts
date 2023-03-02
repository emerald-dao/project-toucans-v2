import { create, enforce, test, only } from 'vest';

const tokenomicsSuite = create((data = {}, currentField) => {
	only(currentField);
	only.group(data.tokenType);

	test('targetAmount', 'Target amount is needed', () => {
		enforce(data.targetAmount).isNotEmpty();
	});

	test('targetAmount', 'Target amount must be greater than 0', () => {
		enforce(data.targetAmount).greaterThan(0);
	});

	test('issuanceRate', 'Issuance rate is needed', () => {
		enforce(data.initialRound.issuanceRate).isNotEmpty();
	});

	test('issuanceRate', 'Issuance rate must be greater than 0', () => {
		enforce(data.initialRound.issuanceRate).greaterThan(0);
	});
});

export default tokenomicsSuite;
