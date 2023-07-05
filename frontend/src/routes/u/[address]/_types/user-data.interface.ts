import type { Profile } from '$lib/types/common/profile.interface';
import type { DaoEvent } from '$lib/types/dao-project/dao-event/dao-event.type';

export interface UserData {
	profile: Profile;
	vaults: Vault[];
	transactions: DaoEvent[];
}

interface DaoProfile {
	name: string;
	logoUrl: string;
	contractName: string;
	tokenSymbol: string;
}

export interface Vault {
	daoData: DaoProfile;
	balance: number;
	tokenValue: number;
}
