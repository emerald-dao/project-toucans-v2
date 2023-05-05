import type { BaseEvent } from './common/base-event.interface';

export interface BatchWithdrawEvent extends BaseEvent {
	type: 'BatchWithdraw';
	data: {
		amount: string;
		tokenSymbol: string;
		currentCycle: string | null;
	};
}
