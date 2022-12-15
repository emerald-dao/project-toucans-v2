import { create, enforce, test, skipWhen, only } from 'vest';

const daoDetailsSuite = create((data = {}, currentField) => {
	only(currentField);

	test('name', 'Your DAO needs a name!', () => {
		enforce(data.name).isNotBlank();
	});

	test('name', 'Name must be at least 4 chars', () => {
		enforce(data.name).longerThan(4);
	});

	skipWhen(daoDetailsSuite.get().hasErrors('name'), () => {
		test.memo(
			'name',
			'Name already taken',
			async () => {
				return await dummyCheckDaoName(true);
			},
			[data.name]
		);
	});

	test('tokenName', 'We need a name for your token', () => {
		enforce(data.tokenName).isNotBlank();
	});

	test('tokenName', 'Token name should be shorter than 5 chars', () => {
		enforce(data.tokenName).shorterThan(5);
	});

	skipWhen(daoDetailsSuite.get().hasErrors('tokenName'), () => {
		test.memo(
			'tokenName',
			'Token name already taken',
			async () => {
				return await dummyCheckDaoName(true);
			},
			[data.tokenName]
		);
	});

	test('description', 'Description is needed', () => {
		enforce(data.description).isNotBlank();
	});

	test('description', 'Description should be longer than 20 chars', () => {
		enforce(data.description).longerThan(20);
	});

	test('website', 'Must be a valid URL', () => {
		enforce(data.website).matches(/^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/);
	});
});

const dummyCheckDaoName = async (success: boolean): Promise<boolean> => {
	return new Promise((resolve, reject) => {
		setTimeout(() => {
			if (success) {
				resolve(true);
			} else {
				reject();
			}
		}, 1000);
	});
};

export default daoDetailsSuite;
