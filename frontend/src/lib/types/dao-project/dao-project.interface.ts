import type { DaoEvent } from './dao-event/dao-event.type';

// A DAO Project is a combination of two data types: DAOBlockchainData and DaoDatabaseData.
// DAOBlockchainData is the data that is stored on the blockchain.
// DaoDatabaseData is the data that is stored in the database. This one is editable by the DAO owner.
// Optionally, DAO type may have an events property, which is an array of DAO events. This is also stored in our DB on a separate table.
export interface DAOProject {
	generalInfo: DaoDatabaseData;
	onChainData: DaoBlockchainData;
	events?: DaoEvent[];
}

export interface DaoDatabaseData {
	contract_address: string | null;
	contract_name: string;
	created_at: string | null;
	description: string | null;
	discord: string | null;
	logo: string | null;
	name: string | null;
	owner: string | null;
	project_id: number;
	token_symbol: string | null;
	twitter: string | null;
	type: string | null;
	website: string | null;
}

export interface DaoBlockchainData {
	projectId: string;
	projectTokenInfo: TokenInfo;
	paymentTokenInfo: TokenInfo;
	totalFunding: string;
	editDelay: string;
	minting: boolean;
}

export interface TokenInfo {
	contractName: string;
	contractAddress: string;
	tokenType: string;
	receiverPath: string;
	publicPath: string;
	storagePath: string;
}
