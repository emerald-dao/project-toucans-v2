import { create, enforce, test, omitWhen } from 'vest';

const validationSuite = create((data = {}) => {
	omitWhen(
		() => data.hasMaxSupply === false,
		() => {
			test('maxSupply', 'Max supply should be greater than 0', () => {
				enforce(data.maxSupply).greaterThan(0);
			});

			test('maxSupply', 'Max supply should be less than 180 billion.', () => {
				enforce(data.maxSupply).lessThan(180000000000);
			})

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
