import { USER_MOCK } from './_mockData/usermock';
import type { UserData } from './_types/user-data.interface';

export const load = (): UserData => {
	return USER_MOCK;
};
