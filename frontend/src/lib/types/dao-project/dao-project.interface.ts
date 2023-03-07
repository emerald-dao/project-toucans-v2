import type { DaoEvent } from './dao-event/dao-event.type';
import type { FundingCycle } from './funding-rounds/funding-cycle.interface';

// A DAO Project is a combination of two data types: DAOBlockchainData and DaoDatabaseData.
// DAOBlockchainData is the data that is stored on the blockchain.
// DaoDatabaseData is the data that is stored in the database. This one is editable by the DAO owner.
// Optionally, DAO type may have an events property, which is an array of DAO events. This is also stored in our DB on a separate table.
export interface DAOProject {
	generalInfo: DaoDatabaseData;
	onChainData: DaoBlockchainData;
	events?: DaoEvent[];
	userBalance?: number;
}

export interface DaoDatabaseData {
	contract_address: string;
	contract_name: string;
	created_at: string;
	description: string;
	discord: string | null;
	logo: string;
	name: string;
	owner: string;
	project_id: number;
	token_symbol: string;
	twitter: string | null;
	website: string | null;
}

export interface DaoBlockchainData {
	projectId: string;
	tokenType: TokenInfo;
	currentFundingCycle: string;
	totalFunding: string;
	editDelay: string;
	extra: {
		[key: string]: string;
	};
	fundingCycles: FundingCycle[];
	totalSupply: string;
	balances: {
		[address: string]: string;
	};
	funders: {
		[address: string]: string;
	};
	overflowBalance: string;
	signers: string[];
	actions: {
		[address: string]: string;
	};
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
