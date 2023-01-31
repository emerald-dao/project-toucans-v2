import type { Currencies } from './currencies.enum';

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

export interface Funders {}

export interface Type {
	kind: string;
}

export interface Field {
	id: string;
	type: Type;
}

export interface TokenType {
	kind: string;
	typeID: string;
	fields: Field[];
	initializers: any[];
	type: string;
}

export interface Details {
	cycleNum: string;
	fundingTarget: string;
	issuanceRate: string;
	reserveRate: string;
	timeFrame: TimeFrame;
	payouts: Payout[];
	extra: Extra;
}

export interface Funders {}

export interface FundingCycle {
	details: Details;
	numOfTokensPurchased: string;
	funders: Funders;
	numOfFlowContributed: string;
	purchaseHistory: any[];
}

export interface CycleInfo {
	cycleNum: string;
	fundingTarget: string;
	issuanceRate: string;
	reserveRate: string;
	timeFrame: TimeFrame;
	payouts: Payout[];
	extra: Extra;
}

export interface Action {
	type: string;
	timestamp: string;
	fundingCycle: string;
	cycleInfo: CycleInfo;
}

export interface Dao {
	contract_name: string;
	created_at: Date;
	contract_address: string;
	token_symbol: string;
	description: string;
	website: string;
	type: DaoType.Community | DaoType.Financial;
	owner: string;
	name: string;
	logo: string;
	twitter: string;
	discord: string;
	projectId: string;
	tokenType: TokenType;
	extra: Extra;
	actions: Action[];
	totalSupply: string;
}

export interface FinancialDao extends Dao {
	currentFundingCycle: string;
	totalBought: string;
	fundingCycles: FundingCycle[];
	funders: Funders;
	type: DaoType.Financial;
}

export interface CommunityDao extends Dao {}
