import type { BaseEvent } from './common/base-event.interface';

export interface DistributeEvent extends BaseEvent {
	type: 'Distribute';
	data: {
		to: string;
		amount: string;
		tokenSymbol: string;
		currentCycle: string | null;
	};
}
