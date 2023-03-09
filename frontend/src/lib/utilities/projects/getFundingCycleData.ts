import type { DAOProject } from '$lib/types/dao-project/dao-project.interface';

export const getFundingCycleData = (daoData: DAOProject, index: number) => {
	const fundingCycle = daoData.onChainData.fundingCycles[index];
	const purchaseHistory = daoData.events?.filter(
		(purchase) => purchase.currentCycle === fundingCycle.details.cycleNum
	);
	return { ...fundingCycle, purchaseHistory };
};
