import type { TDaoEvent } from '$lib/types/dao-project/dao-event/dao-event.type';

export const getTotalFundingFromActions = (actions: TDaoEvent[]) => {
	const fundings = actions.reduce((acc, action) => {
		if (action.type === 'Purchase') {
			acc += Number(action.amount);
		}
		return acc;
	}, 0);

	return fundings;
};
