import type { BaseEvent } from './common/base-event.interface';

export interface PurchaseEvent extends BaseEvent {
	type: 'Purchase';
	data: {
		amount: string;
		message: string;
		projectOwner: string;
		tokenTypeIdentifier: string;
		currentCycle: string;
		by: string;
	};
}
