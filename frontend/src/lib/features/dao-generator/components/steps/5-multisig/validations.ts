import { create, enforce, test, only } from 'vest';

const validationSuite = create((data = {}, currentField, index: number) => {
	only(currentField);

	test(`multisig-wallet-${index}`, 'Wallet address is needed', () => {
		enforce(data.addresses[index]).isNotEmpty();
	});

	test(`multisig-wallet-${index}`, 'Wallet address should be exactly 18 chars long', () => {
		enforce(data.addresses[index]).lengthEquals(18);
	});
});

export default validationSuite;
