import { canReceiveProjectToken, canReceiveToucansToken } from '$flow/actions';
import { ECurrencies } from '$lib/types/common/enums';
import type { Distribution } from '$lib/types/dao-project/funding-rounds/distribution.interface';
import { create, enforce, test, only, skipWhen, omitWhen } from 'vest';

const fungibleTokenDistributionValidation = create(
	(
		data: Distribution,
		currentField,
		availableBalance: number | undefined | 'infinite',
		amountOfTokensInStaging: number,
		contractAddress: string | null,
		projectId: string,
		currencyToDistribute: ECurrencies | string
	) => {
		only(currentField);

		test('address', 'Address should have 18 chars', () => {
			enforce(data.address).lengthEquals(18);
		});

		test('address', 'Address should start with 0x', () => {
			enforce(data.address).startsWith('0x');
		});

		skipWhen(fungibleTokenDistributionValidation.get().hasErrors('address'), () => {
			test('address', "Address doesn't have a vault set up.", async () => {
				return (await checkAddress(
					data.address,
					contractAddress,
					projectId,
					currencyToDistribute
				)) as string;
			});
		});

		test('amount', 'Amount should me greater than 0', () => {
			enforce(data.amount).greaterThan(0);
		});

		omitWhen(availableBalance === undefined || availableBalance === 'infinite', () => {
			test('amount', `Treasury doesn't have enough tokens`, () => {
				enforce(data.amount).lessThan((availableBalance as number) - amountOfTokensInStaging);
			});
		});
	}
);

const checkAddress = async (
	address: string,
	contractAddress: string | null,
	projectId: string,
	currencyToDistribute: ECurrencies | string
) => {
	return new Promise((resolve, reject) => {
		setTimeout(async () => {
			let success;
			if (currencyToDistribute == ECurrencies.FLOW || currencyToDistribute == ECurrencies.USDC) {
				success = await canReceiveToucansToken(address, currencyToDistribute);
			} else {
				success = await canReceiveProjectToken(contractAddress as string, projectId, address);
			}

			if (success) {
				resolve(true);
			} else {
				reject();
			}
		}, 1000);
	});
};

export default fungibleTokenDistributionValidation;
