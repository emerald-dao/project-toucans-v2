import type { BaseEvent } from './common/base-event.interface';

export interface DonateEvent extends BaseEvent {
	type: 'Donate';
	amount: string;
	projectOwner: string;
}
