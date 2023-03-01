import type { FinancialDao } from '$lib/types/dao-project/dao-project.interface';

export const getFundingCycleData = (daoData: FinancialDao, index: number) => {
	const fundingCycle = daoData.fundingCycles[index];
	const purchaseHistory = daoData.purchaseHistory.filter(
		(purchase) => purchase.currentCycle === daoData.mostRecentCycle
	);
	return { ...fundingCycle, purchaseHistory };
};
