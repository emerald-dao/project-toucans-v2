import type { BaseEvent } from './common/base-event.interface';

export interface MintEvent extends BaseEvent {
	type: 'Mint';
	data: {
		to: string;
		amount: string;
		tokenSymbol: string;
		currentCycle: string | null;
	};
}
