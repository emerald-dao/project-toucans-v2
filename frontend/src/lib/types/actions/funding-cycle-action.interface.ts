import type { BaseAction } from './actions.type';

export interface Timeframe {
	startTime: string;
	endTime: string;
}

export interface FundingCycleAction extends BaseAction {
	type: 'NewFundingCycle';
	cycleNum: string;
	fundingTarget: string;
	issuanceRate: string;
	reserveRate: string;
	timeframe: Timeframe;
}
