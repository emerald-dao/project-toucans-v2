import type { FundingCycleAction } from './actions/funding-cycle-action.interface';
import type { PurchaseAction } from './actions/purchase-action.interface';
import type { Funders, FundingCycle } from './funding-cycle.interface';

export enum DaoTags {
	'Education' = 'Education',
	'Building' = 'Building',
	'Community' = 'Community'
}

export enum DaoType {
	'Community' = 'Community',
	'Financial' = 'Financial'
}

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

interface Extra {
	[extra: string]: string;
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
	project_id: string;
	tokenType: TokenType;
	extra: Extra;
	actions: [PurchaseAction | FundingCycleAction];
	totalSupply: string;
}

export interface FinancialDao extends Dao {
	currentFundingCycle: string;
	mostRecentCycle: string;
	totalFunding: string;
	fundingCycles: FundingCycle[];
	funders: Funders;
	type: DaoType.Financial;
	purchaseHistory: PurchaseAction[];
}

export interface CommunityDao extends Dao {
	balances: {
		[account: string]: string;
	};
}
