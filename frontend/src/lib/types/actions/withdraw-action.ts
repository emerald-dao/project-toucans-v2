import type { BaseAction } from './actions.type';

export interface WithdrawAction extends BaseAction {
	type: 'Withdraw';
	amount: string;
	projectOwner: string;
	address: string;
}
