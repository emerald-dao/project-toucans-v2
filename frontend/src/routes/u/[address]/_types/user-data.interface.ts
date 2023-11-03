import type { Profile } from '$lib/types/common/profile.interface';
import type { DaoEvent } from '$lib/types/dao-project/dao-event/dao-event.type';

export interface UserData {
	profile: Profile;
	vaults: Vault[];
	transactions: DaoEvent[];
}

interface DaoProfile {
	owner: string;
	name: string;
	logoUrl: string;
	projectId: string;
	tokenSymbol: string;
}

export interface Vault {
	daoData: DaoProfile;
	balance: number;
	tokenValue: number;
}
