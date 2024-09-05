import type { Profile } from '$lib/types/common/profile.interface';
import type { DaoEvent } from '$lib/types/dao-project/dao-event/dao-event.type';

export interface UserData {
	profile: Profile;
	vaults: Vault[];
	transactions: DaoEvent[];
}

interface TokenProfile {
	name: string;
	logoUrl: string;
	tokenSymbol: string;
	projectId?: string;
	owner?: string;
	contractAddress?: string;
}

export interface Vault {
	daoData: TokenProfile;
	balance: number;
	tokenValue: number;
}
