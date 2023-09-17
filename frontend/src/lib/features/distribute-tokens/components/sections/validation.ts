import { canReceiveProjectToken, canReceiveToken, canReceiveToucansToken } from '$flow/actions';
import { ECurrencies } from '$lib/types/common/enums';
import type { Distribution } from '$lib/types/dao-project/funding-rounds/distribution.interface';
import { create, enforce, test, only, skipWhen, omitWhen } from 'vest';

const validationSuite = create((data: Distribution, currentField, availableBalance: number | undefined, projectOwner: string, projectId: string, currencyToDistribute: ECurrencies | string) => {
	only(currentField);

	test('address', 'Address should have 18 chars', () => {
		enforce(data.address).lengthEquals(18);
	});

	skipWhen(validationSuite.get().hasErrors('address'), () => {
		test.memo(
			'address',
			"Address doesn't have a vault set up.",
			async () => {
				return (await checkAddress(data.address, projectOwner, projectId, currencyToDistribute)) as string;
			},
			[data.address]
		);
	});

	test('amount', 'Amount should me greater than 0', () => {
		enforce(data.amount).greaterThan(0);
	});

	omitWhen(availableBalance === undefined, () => {
		test('amount', 'Amount should be less than your available balance', () => {
			enforce(data.amount).lessThan(availableBalance);
		});
	});
});

const checkAddress = async (address: string, projectOwner: string, projectId: string, currencyToDistribute: ECurrencies | string,) => {
	return new Promise((resolve, reject) => {
		setTimeout(async () => {
			let success;
			if (currencyToDistribute == ECurrencies.FLOW || currencyToDistribute == ECurrencies.USDC) {
				success = await canReceiveToucansToken(address, currencyToDistribute)
			} else {
				success = await canReceiveProjectToken(projectOwner, projectId, address, currencyToDistribute)
			}

			if (success) {
				resolve(true);
			} else {
				reject();
			}
		}, 1000);
	});
};

export default validationSuite;
