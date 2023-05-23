import type { BaseEvent } from './common/base-event.interface';

export interface FundingCycleEvent extends BaseEvent {
	type: 'NewFundingCycle';
	data: {
		by: string;
		newCycleId: string;
		fundingTarget: string;
		issuanceRate: string;
		reserveRate: string;
		timeframe: {
			endTime: string;
			startTime: string;
		};
	};
}
