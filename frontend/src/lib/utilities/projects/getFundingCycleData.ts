import type { FundingCycle } from '$lib/types/dao-project/funding-rounds/funding-cycle.interface';
import type { DaoEvent } from '$lib/types/dao-project/dao-event/dao-event.type';

export const getFundingCycleData = (
	fundingCycles: FundingCycle[],
	events: DaoEvent[],
	index: number
) => {
	const fundingCycle = fundingCycles[index];
	const purchaseHistory = events.filter((event) => {
		if (event.type === 'Purchase') {
			event.data.currentCycle === fundingCycle.details.cycleNum;
		}
	});
	return { ...fundingCycle, purchaseHistory };
};
