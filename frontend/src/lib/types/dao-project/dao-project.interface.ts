import type { DaoEvent } from './dao-event/dao-event.type';
import type { FundingCycle } from './funding-rounds/funding-cycle.interface';
import type { MultisigActions } from './multisig-actions/multisig-actions.type';
import type { ECurrencies } from '../common/enums';
import type { VotingRound } from '$lib/utilities/api/supabase/fetchAllVotingRounds';
import type { DaoDatabaseData } from '$lib/utilities/api/supabase/fetchProject';

// A DAO Project is a combination of two data types: DAOBlockchainData and DaoDatabaseData.
// DAOBlockchainData is the data that is stored on the blockchain.
// DaoDatabaseData is the data that is stored in the database. This one is editable by the DAO owner.
// Optionally, DAO type may have an events property, which is an array of DAO events. This is also stored in our DB on a separate table.
export interface DAOProject {
	generalInfo: DaoDatabaseData;
	onChainData: DaoBlockchainData;
	events: DaoEvent[];
	userBalance?: number;
	vaultSetup?: boolean;
	hasToken: boolean;
	funding: {
		numbers: number[];
		total_funding: number;
		funders: { [address: string]: { amount: number; num_nfts: number } };
	};
	votingRounds: VotingRound[];
}

export interface DaoBlockchainData {
	projectId: string;
	tokenType: string;
	currentFundingCycle: FundingCycle | null;
	editDelay: string;
	extra: {
		[key: string]: string;
	};
	fundingCycles: FundingCycle[];
	totalSupply: string;
	purchasing: boolean;
	maxSupply: string | null;
	requiredNft: RequiredNft | null;
	allowedNFTCollections: string[];
	balances: {
		[address: string]: string;
	};
	overflowBalance: string;
	signers: string[];
	threshold: string;
	actions: ActionData[];
	minting: boolean;
	treasuryBalances: {
		FLOW?: string;
		USDC?: string;
		[key: string]: string | undefined;
	};
	paymentCurrency: ECurrencies;
	trading: boolean;
	lpAddresses: {
		[key: string]: string;
	};
	completedActionIds: {
		[actionId: string]: boolean;
	};
}

export interface TokenInfo {
	contractName: string;
	contractAddress: string;
	tokenType: string;
	receiverPath: {
		domain: 'public';
		identifier: string;
	};
	symbol: string;
	publicPath: {
		domain: 'public';
		identifier: string;
	};
	storagePath: {
		domain: 'storage';
		identifier: string;
	};
	image: string;
}

export interface ActionData {
	id: string;
	intent: string;
	title: MultisigActions;
	threshold: string;
	signers: string[];
	votes: {
		[voter: string]: boolean;
	};
}

export interface RequiredNft {
	identifier: string;
	image: string;
	name: string;
	link: string;
}
