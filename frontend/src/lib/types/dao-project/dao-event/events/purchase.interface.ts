import type { BaseEvent } from './common/base-event.interface';

export interface PurchaseEvent extends BaseEvent {
	type: 'Purchase';
	data: {
		amount: string;
		message: string;
		projectOwner: string;
		tokenSymbol: string;
		currentCycle: string;
		by: string;
	};
}
