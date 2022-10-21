import { create, enforce, test, skipWhen, only } from 'vest';

const tokenomicsSuite = create((data = {}, currentField) => {
	only(currentField);

	test('targetAmount', 'Target amount is needed', () => {
		enforce(data.initialRound.targetAmount).isNotEmpty();
	});

	test('targetAmount', 'Target amount must be greater than 0', () => {
		enforce(data.initialRound.targetAmount).greaterThan(0);
	});

	test('issuanceRate', 'Issuance rate is needed', () => {
		enforce(data.initialRound.issuanceRate).isNotEmpty();
	});

	test('issuanceRate', 'Issuance rate must be greater than 0', () => {
		enforce(data.initialRound.issuanceRate).greaterThan(0);
	});

	test('reserveRate', 'Reserve rate is needed', () => {
		enforce(data.initialRound.reserveRate).isNotEmpty();
	});

	test('reserveRate', 'Reserve rate must be greater than 0', () => {
		enforce(data.initialRound.reserveRate).greaterThan(0);
	});

	test('reserveRate', 'Reserve rate must be less than or equal to 100', () => {
		enforce(data.initialRound.reserveRate).lessThanOrEquals(100);
	});

	test('supply', 'Total supply is needed', () => {
		enforce(data.totalSupply).isNotEmpty();
	});

	test('supply', 'Total supply must be greater than 0', () => {
		enforce(data.totalSupply).greaterThan(0);
	});
});

export default tokenomicsSuite;
