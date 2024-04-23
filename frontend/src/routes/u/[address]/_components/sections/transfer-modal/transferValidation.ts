import { canReceiveProjectToken, canReceiveToucansToken } from '$flow/actions';
import { ECurrencies } from '$lib/types/common/enums';
import { create, enforce, test, only, skipWhen, omitWhen } from 'vest';

const transferValidation = create(
	(
		address: string,
		amount: number,
		currentField,
		availableBalance: number,
		projectOwner: string,
		projectId: string,
		currencyToDistribute: ECurrencies | string
	) => {
		only(currentField);

		test('address', 'Address should have 18 chars', () => {
			enforce(address).lengthEquals(18);
		});

		test('address', 'Address should start with 0x', () => {
			enforce(address).startsWith('0x');
		});

		skipWhen(transferValidation.get().hasErrors('address'), () => {
			test('address', "Address doesn't have a vault set up.", async () => {
				return (await checkAddress(
					address,
					projectOwner,
					projectId,
					currencyToDistribute
				)) as string;
			});
		});

		test('amount', 'Amount should me greater than 0', () => {
			enforce(amount).greaterThan(0);
		});

		test('amount', `You don't have enough tokens to transfer`, () => {
			enforce(amount).lessThanOrEquals(availableBalance);
		});
	}
);

const checkAddress = async (
	address: string,
	projectOwner: string,
	projectId: string,
	currencyToDistribute: ECurrencies | string
) => {
	return new Promise((resolve, reject) => {
		setTimeout(async () => {
			let success;
			if (
				currencyToDistribute == ECurrencies.FLOW ||
				currencyToDistribute == ECurrencies.USDC ||
				currencyToDistribute == ECurrencies.stFlow
			) {
				success = await canReceiveToucansToken(address, currencyToDistribute);
			} else {
				success = await canReceiveProjectToken(projectOwner, projectId, address);
			}

			if (success) {
				resolve(true);
			} else {
				reject();
			}
		}, 1000);
	});
};

export default transferValidation;
