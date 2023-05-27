import type { BaseEvent } from './common/base-event.interface';

export interface BurnEvent extends BaseEvent {
	type: 'Burn';
	data: {
		amount: string;
		tokenSymbol: string;
		currentCycle: string | null;
	};
}
