import type { PurchaseAction } from './purchase-action.interface';
import type { FundingCycleAction } from './funding-cycle-action.interface';
import type { WithdrawAction } from './withdraw-action';
import type { DonateAction } from './donate-action';
import type { ProjectCreatedAction } from './project-created-action';

export type Action = PurchaseAction | FundingCycleAction | WithdrawAction | DonateAction | ProjectCreatedAction;

export type ActionType = 'Purchase' | 'Withdraw' | 'NewFundingCycle' | 'Donate' | 'ProjectCreated';

export interface BaseAction {
	by: string;
	type: ActionType;
	timestamp: number;
	currentCycle: string;
}
