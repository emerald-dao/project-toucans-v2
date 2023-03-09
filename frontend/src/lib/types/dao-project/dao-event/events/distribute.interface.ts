import type { BaseEvent } from './common/base-event.interface';

export interface DistributeEvent extends BaseEvent {
	type: 'Distribute';
	amount: string;
	to: string;
	projectOwner: string;
}
