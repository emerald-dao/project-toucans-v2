import type { FundingCycle } from '$lib/types/dao-project/funding-rounds/funding-cycle.interface';
import type { DaoEvent } from '$lib/types/dao-project/dao-event/dao-event.type';

export const getFundingCycleData = (
	fundingCycles: FundingCycle[],
	events: DaoEvent[],
	index: string
) => {
	const fundingCycle = fundingCycles.find(cycle => cycle.details.cycleId == index) as FundingCycle;
	const purchaseHistory = events.filter((event) => {
		if (event.type === 'Purchase') {
			event.data.currentCycle === fundingCycle.details.cycleId;
		}
	});
	return { ...fundingCycle, purchaseHistory };
};
