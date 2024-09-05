import type { BaseEvent } from '$lib/utilities/api/supabase/fetchProjectEvents';

export interface FundingCycleEvent extends BaseEvent {
	type: 'NewFundingCycle';
	data: {
		projectOwner: string;
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
