import type { BaseEvent } from './common/base-event.interface';

export interface PurchaseEvent extends BaseEvent {
	type: 'Purchase';
	amount: string;
	message: string;
	projectOwner: string;
}
