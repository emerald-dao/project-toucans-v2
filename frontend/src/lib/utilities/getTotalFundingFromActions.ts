import type { Action } from '$lib/types/actions/actions.type';

export const getTotalFundingFromActions = (actions: Action[]) => {
	const fundings = actions.reduce((acc, action) => {
		if (action.type === 'Purchase') {
			acc += Number(action.amount);
		}
		return acc;
	}, 0);

	return fundings;
};
