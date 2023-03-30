import { create, enforce, test, omitWhen } from 'vest';

const validationSuite = create((data = {}) => {
	omitWhen(
		() => data.hasMaxSupply === false,
		() => {
			test('maxSupply', 'Max supply should be greater than 0', () => {
				enforce(data.maxSupply).greaterThan(0);
			});

			test('maxMinting', 'Max minting should be less than max supply', () => {
				enforce(data.maxMinting).lessThanOrEquals(data.maxSupply);
			});

			test('initialSupply', 'Initial supply should be less than max supply', () => {
				enforce(data.initialSupply).lessThanOrEquals(data.maxSupply);
			});
		}
	);

	test('initialSupply', 'Initial supply greater than or equals 0', () => {
		enforce(data.initialSupply).greaterThanOrEquals(0);
	});
});

export default validationSuite;
