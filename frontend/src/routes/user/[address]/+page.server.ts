import { USER_MOCK } from './_mockData/usermock';
import type { UserData } from './_types/user-data.interface';

export const load = (): UserData => {
	// sort daos by highest value
	USER_MOCK.vaults.sort((a, b) => {
		return b.balance * b.tokenValue - a.balance * a.tokenValue;
	});

	return USER_MOCK;
};
