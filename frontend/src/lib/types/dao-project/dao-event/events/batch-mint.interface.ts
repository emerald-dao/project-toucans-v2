import type { BaseEvent } from './common/base-event.interface';

export interface BatchMintEvent extends BaseEvent {
	type: 'BatchMint';
	data: {
		amount: string;
		tokenSymbol: string;
		currentCycle: string | null;
		amounts: { [address: string]: string }
	};
}
