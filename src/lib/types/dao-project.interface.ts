import type { Currencies } from './currencies.enum';

interface DaoInfo {
	name: string;
	type: DaoType;
	address: string;
	token: string;
	founder: string;
	dateFounded: Date;
	logoUrl: string;
	tags: DaoTags[];
	description: string;
	maxSupply: number;
	circulatingSupply: number;
	socials: {
		website: string;
		twitter: string;
		discord: string;
	};
}

export interface FinancialDao extends DaoInfo {
	type: DaoType.Financial;
	mainFunders: [string, number][];
	rounds: Round[];
	totalFlowRaised: number;
}

export interface CommunityDao extends DaoInfo {
	type: DaoType.Community;
	mainHolders: [string, number][];
}

// export interface Round {
// 	status: 'active' | 'finished';
// 	currency: Currencies.FLOW | Currencies.FUSD;
// 	goal: number;
// 	raised: number;
// 	startDate: Date;
// 	finishDate: Date;
// 	distributed: boolean;
// 	withdrawn: boolean;
// 	fundings: Funding[];
// }

export interface Activity {
	type: 'entry' | 'expense';
	currency: Currencies.FLOW | Currencies.FUSD;
	amount: number;
	account: string;
	date: Date;
}

export interface Funding extends Activity {
	type: 'entry';
}

export enum DaoTags {
	'Education' = 'Education',
	'Building' = 'Building',
	'Community' = 'Community'
}

export enum DaoType {
	'Community' = 'Community',
	'Financial' = 'Financial'
}

export interface TimeFrame {
	startTime: string;
	endTime: string;
}

export interface Payout {
	address: string;
	percent: string;
}

export interface Extra {}

export interface RoundDetails {
	cycleNum: string;
	fundingTarget: string;
	issuanceRate: string;
	reserveRate: string;
	timeFrame: TimeFrame;
	payouts: Payout[];
	extra: Extra;
}

export interface Funders {}

export interface Round {
	details: RoundDetails;
	numOfTokensPurchased: string;
	funders: Funders;
	numOfFlowContributed: string;
	purchaseHistory: any[];
}
