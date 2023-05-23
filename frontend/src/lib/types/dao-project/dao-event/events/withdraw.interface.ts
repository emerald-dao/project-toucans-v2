import type { BaseEvent } from './common/base-event.interface';

export interface WithdrawEvent extends BaseEvent {
	type: 'Withdraw';
	data: {
		to: string;
		amount: string;
		tokenSymbol: string;
		currentCycle: string | null;
	};
}
