import { hasVaultSetup } from '$flow/actions';
import { ECurrencies } from '$lib/types/common/enums';
import { create, enforce, test, only, skipWhen, omitWhen } from 'vest';

const validationSuite = create((data = {}, currentField, availableBalance: number | undefined, projectOwner: string, projectId: string, currencyToDistribute: ECurrencies | string) => {
	only(currentField);

	test('address', 'Address should have 18 chars', () => {
		enforce(data.account).lengthEquals(18);
	});

	skipWhen(validationSuite.get().hasErrors('address'), () => {
		test.memo(
			'address',
			"Address doesn't have a vault set up.",
			async () => {
				return (await checkAddress(data.account, projectOwner, projectId, currencyToDistribute)) as string;
			},
			[data.account]
		);
	});

	test('amount', 'Amount should me greater than 0', () => {
		enforce(data.tokens).greaterThan(0);
	});

	omitWhen(availableBalance === undefined, () => {
		test('amount', 'Amount should be less than your available balance', () => {
			enforce(data.tokens).lessThan(availableBalance);
		});
	});
});

const checkAddress = async (address: string, projectOwner: string, projectId: string, currencyToDistribute: ECurrencies | string) => {
	return new Promise((resolve, reject) => {
		setTimeout(async () => {
			const success = await hasVaultSetup(projectOwner, projectId, address, currencyToDistribute)
			if (success) {
				resolve(true);
			} else {
				reject();
			}
		}, 1000);
	});
};

export default validationSuite;
