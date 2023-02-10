import { create, enforce, test, only, group } from 'vest';
import { TokenTypes } from '../types/token-types.enum';

const tokenomicsSuite = create((data = {}, currentField) => {
	only(currentField);
	only.group(data.tokenType);

	group(TokenTypes.FINANCIAL, () => {
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

	group(TokenTypes.COMMUNITY, () => {
		test('supply', 'Total supply is needed', () => {
			enforce(data.totalSupply).isNotEmpty();
		});

		test('supply', 'Total supply must be greater than 0', () => {
			enforce(data.totalSupply).greaterThan(0);
		});
	});
});

export default tokenomicsSuite;
