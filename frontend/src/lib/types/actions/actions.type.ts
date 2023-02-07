import type { PurchaseAction } from './purchase-action.interface';
import type { FundingCycleAction } from './funding-cycle-action.interface';
import type { WithdrawAction } from './withdraw-action';
import type { DonateAction } from './donate-action';

export type Action = PurchaseAction | FundingCycleAction | WithdrawAction | DonateAction;

export type ActionType = 'Purchase' | 'Withdraw' | 'NewFundingCycle' | 'Donate';

export interface BaseAction {
	by: string;
	type: ActionType;
	timestamp: number;
	currentCycle: string;
}
