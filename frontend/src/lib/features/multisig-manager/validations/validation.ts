import { create, each, enforce, test } from 'vest';

export const thresholdSuite = create((data = '', amountOfSignatures) => {
	test(`threshold`, 'Threshold is needed', () => {
		enforce(data).isNotEmpty();
	});

	test(`threshold`, 'Threshold should be greater than or equal to 1', () => {
		enforce(data).greaterThanOrEquals(1);
	});

	test(`threshold`, 'Threshold should be less than or equals to the amount of signatures', () => {
		enforce(data).lessThanOrEquals(amountOfSignatures);
	});
});

export const walletsSuite = create(
	(
		data: {
			address: string;
			id: string;
		}[] = []
	) => {
		each(data, (field) => {
			console.log(field);

			test(
				field.address,
				'Wallet address is needed',
				() => {
					enforce(field.address).isNotEmpty();
				},
				field.id
			);
		});

		each(data, (field) => {
			test(
				field.address,
				'Wallet address should be exactly 18 chars long',
				() => {
					enforce(field.address).lengthEquals(18);
				},
				field.id
			);
		});
	}
);
