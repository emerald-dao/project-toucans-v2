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
	totalTokens: number;
	socials: {
		website: string;
		twitter: string;
		discord: string;
	};
}

export interface FinancialDao extends DaoInfo {
	type: DaoType.Financial;
	rounds: Round[];
	totalFusdRaised: number;
}

export interface CommunityDao extends DaoInfo {
	type: DaoType.Community;
	mainHolders: [string, number][];
}

export interface Round {
	status: 'active' | 'finished';
	currency: Currencies.FLOW | Currencies.FUSD;
	goal: number;
	raised: number;
	startDate: Date;
	finishDate: Date;
	distributed: boolean;
	withdrawn: boolean;
}

export interface Activity {
	type: 'entry' | 'expense';
	currency: Currencies.FLOW | Currencies.FUSD;
	amount: number;
	account: string;
}

export enum DaoTags {
	'Education' = 'education',
	'Building' = 'building',
	'Community' = 'community'
}

export enum DaoType {
	'Community' = 'community',
	'Financial' = 'financial'
}
