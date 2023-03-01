import type { BaseEvent } from './common/base-event.interface';

export interface WithdrawEvent extends BaseEvent {
	type: 'Withdraw';
	amount: string;
	projectOwner: string;
	address: string;
}
