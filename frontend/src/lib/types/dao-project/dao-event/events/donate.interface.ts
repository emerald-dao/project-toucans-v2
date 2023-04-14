import type { BaseEvent } from './common/base-event.interface';

export interface DonateEvent extends BaseEvent {
	type: 'Donate';
	data: {
		amount: string;
		message: string;
		projectOwner: string;
		tokenSymbol: string;
		currentCycle: string;
		by: string;
	};
}
