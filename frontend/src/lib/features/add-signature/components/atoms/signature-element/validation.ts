import { create, enforce, test } from 'vest';

export const validationSuite = create((data = '', index: number) => {
	test(`multisig-wallet-${index}`, 'Wallet address is needed', () => {
		enforce(data).isNotEmpty();
	});

	test(`multisig-wallet-${index}`, 'Wallet address should be exactly 18 chars long', () => {
		enforce(data).lengthEquals(18);
	});
});
