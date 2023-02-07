import type { BaseAction } from './actions.type';

export interface DonateAction extends BaseAction {
	type: 'Donate';
	amount: string;
	projectOwner: string;
}
