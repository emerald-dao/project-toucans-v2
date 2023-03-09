import type { BaseEvent } from './common/base-event.interface';

export interface FundingCycleEvent extends BaseEvent {
	type: 'NewFundingCycle';
	cycleNum: string;
	fundingTarget: string;
	issuanceRate: string;
	reserveRate: string;
	timeframe: {
		startTime: string;
		endTime: string;
	};
}
