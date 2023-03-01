import type { BaseAction } from './actions.type';

export interface DistributeAction extends BaseAction {
	type: 'Distribute';
	amount: string;
	to: string;
	projectOwner: string;
}
