import type { DaoEvent } from '$lib/types/dao-project/dao-event/dao-event.type';

export interface UserData {
	name: string;
	avatar: string;
	address: string;
	signerOf: DaoProfile[];
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
