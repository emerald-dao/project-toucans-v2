import type { Currencies } from './currencies.enum';

export interface DaoInfo {
	daoName: string;
	daoAddress: string;
	tokenName: string;
	funderAddress: string;
}

export interface FullDaoProject extends DaoInfo {
	stats: DaoStats;
	rounds: Round[];
	activity: Activity[];
}

export interface DaoStats {
	totalMoneyRised: number;
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
