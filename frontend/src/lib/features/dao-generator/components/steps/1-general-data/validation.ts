import { create, enforce, test, skipWhen, only, include, optional } from 'vest';

const validationSuite = create((data = {}, daoProjects, currentField?) => {
	if (currentField) {
		only(currentField);
	}

	include('contractName').when(() => currentField === 'name');

	optional(['website', 'discord', 'twitter']);

	test('name', 'Your DAO needs a name!', () => {
		enforce(data.name).isNotBlank();
	});

	test('name', 'Name must be at least 4 chars', () => {
		enforce(data.name).longerThan(4);
	});

	skipWhen(validationSuite.get().hasErrors('name'), () => {
		test.memo(
			'name',
			'Name already taken',
			async () => {
				await checkDaoName(data.name, daoProjects);
			},
			[data.name]
		);
	});

	skipWhen(validationSuite.get().hasErrors('name'), () => {
		test.memo(
			'contractName',
			'Contract name already taken',
			async () => {
				await checkDaoContract(data.contractName, daoProjects);
			},
			[data.contractName]
		);
	});

	test('tokenName', 'We need a name for your token', () => {
		enforce(data.tokenName).isNotBlank();
	});

	test('tokenName', 'Token name should be shorter than 6 chars', () => {
		enforce(data.tokenName).shorterThan(6);
	});

	// token name cannot be equal to "FLOW", "FUSD", "USD", "BTC", "ETH" or any other known currency symbol
	test('tokenName', 'Token name cannot be equal to known currency names', () => {
		enforce(data.tokenName).notEquals('FLOW');
		enforce(data.tokenName).notEquals('FUSD');
		enforce(data.tokenName).notEquals('USD');
		enforce(data.tokenName).notEquals('BTC');
		enforce(data.tokenName).notEquals('ETH');
		enforce(data.tokenName).notEquals('EUR');
		enforce(data.tokenName).notEquals('GBP');
		enforce(data.tokenName).notEquals('JPY');
		enforce(data.tokenName).notEquals('CNY');
		enforce(data.tokenName).notEquals('CAD');
		enforce(data.tokenName).notEquals('AUD');
		enforce(data.tokenName).notEquals('CHF');
		enforce(data.tokenName).notEquals('RUB');
		enforce(data.tokenName).notEquals('INR');
		enforce(data.tokenName).notEquals('BRL');
		enforce(data.tokenName).notEquals('TRY');
		enforce(data.tokenName).notEquals('ZAR');
		enforce(data.tokenName).notEquals('MXN');
		enforce(data.tokenName).notEquals('SGD');
		enforce(data.tokenName).notEquals('HKD');
		enforce(data.tokenName).notEquals('NOK');
		enforce(data.tokenName).notEquals('SEK');
		enforce(data.tokenName).notEquals('KRW');
		enforce(data.tokenName).notEquals('IDR');
		enforce(data.tokenName).notEquals('ILS');
		enforce(data.tokenName).notEquals('PHP');
		enforce(data.tokenName).notEquals('PLN');
		enforce(data.tokenName).notEquals('TWD');
		enforce(data.tokenName).notEquals('THB');
		enforce(data.tokenName).notEquals('MYR');
		enforce(data.tokenName).notEquals('CZK');
		enforce(data.tokenName).notEquals('DKK');
		enforce(data.tokenName).notEquals('HUF');
		enforce(data.tokenName).notEquals('RON');
		enforce(data.tokenName).notEquals('COP');
		enforce(data.tokenName).notEquals('ATOM');
		enforce(data.tokenName).notEquals('XRP');
		enforce(data.tokenName).notEquals('XLM');
		enforce(data.tokenName).notEquals('EOS');
		enforce(data.tokenName).notEquals('BCH');
		enforce(data.tokenName).notEquals('LTC');
		enforce(data.tokenName).notEquals('LINK');
		enforce(data.tokenName).notEquals('XTZ');
		enforce(data.tokenName).notEquals('MKR');
		enforce(data.tokenName).notEquals('BAT');
		enforce(data.tokenName).notEquals('ZRX');
		enforce(data.tokenName).notEquals('REP');
		enforce(data.tokenName).notEquals('KNC');
		enforce(data.tokenName).notEquals('DAI');
		enforce(data.tokenName).notEquals('WBTC');
		enforce(data.tokenName).notEquals('USDC');
		enforce(data.tokenName).notEquals('USDT');
		enforce(data.tokenName).notEquals('UNI');
		enforce(data.tokenName).notEquals('AAVE');
		enforce(data.tokenName).notEquals('YFI');
		enforce(data.tokenName).notEquals('COMP');
		enforce(data.tokenName).notEquals('SNX');
		enforce(data.tokenName).notEquals('SUSHI');
		enforce(data.tokenName).notEquals('UMA');
		enforce(data.tokenName).notEquals('BAL');
		enforce(data.tokenName).notEquals('CRV');
		enforce(data.tokenName).notEquals('REN');
		enforce(data.tokenName).notEquals('CAKE');
		enforce(data.tokenName).notEquals('BUSD');
		enforce(data.tokenName).notEquals('SXP');
		enforce(data.tokenName).notEquals('BAND');
		enforce(data.tokenName).notEquals('KSM');
		enforce(data.tokenName).notEquals('DOT');
		enforce(data.tokenName).notEquals('EGLD');
		enforce(data.tokenName).notEquals('SOL');
		enforce(data.tokenName).notEquals('AVAX');
		enforce(data.tokenName).notEquals('NEAR');
		enforce(data.tokenName).notEquals('FIL');
		enforce(data.tokenName).notEquals('ICP');
		enforce(data.tokenName).notEquals('FTT');
		enforce(data.tokenName).notEquals('SRM');
		enforce(data.tokenName).notEquals('RUNE');
		enforce(data.tokenName).notEquals('LRC');
		enforce(data.tokenName).notEquals('OXT');
		enforce(data.tokenName).notEquals('GRT');
		enforce(data.tokenName).notEquals('UMA');
		enforce(data.tokenName).notEquals('YFI');
		enforce(data.tokenName).notEquals('ADA');
		enforce(data.tokenName).notEquals('CAKE');
	});

	skipWhen(validationSuite.get().hasErrors('tokenName'), () => {
		test.memo(
			'tokenName',
			'Token name already taken',
			async () => {
				await checkDaoToken(data.tokenName, daoProjects);
			},
			[data.tokenName]
		);
	});
});

const checkDaoName = async (value: string, daoProjects: DaoProject[]): Promise<boolean> => {
	return new Promise((resolve, reject) => {
		if (daoProjects.some((obj) => obj.name.toUpperCase() === value.toUpperCase())) {
			reject();
		} else {
			resolve(true);
		}
	});
};

const checkDaoContract = async (value: string, daoProjects: DaoProject[]): Promise<boolean> => {
	return new Promise((resolve, reject) => {
		if (daoProjects.some((obj) => obj.project_id.toUpperCase() === value.toUpperCase())) {
			reject();
		} else {
			resolve(true);
		}
	});
};

const checkDaoToken = async (value: string, daoProjects: DaoProject[]): Promise<boolean> => {
	return new Promise((resolve, reject) => {
		if (daoProjects.some((obj) => obj.token_symbol.toUpperCase() === value.toUpperCase())) {
			reject();
		} else {
			resolve(true);
		}
	});
};

export interface DaoProject {
	name: string;
	token_symbol: string;
	project_id: string;
}

export default validationSuite;
