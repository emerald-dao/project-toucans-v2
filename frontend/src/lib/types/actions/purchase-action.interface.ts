import type { BaseAction } from './actions.type';

export interface PurchaseAction extends BaseAction {
	type: 'Purchase';
	amount: string;
	message: string;
	projectOwner: string;
}
