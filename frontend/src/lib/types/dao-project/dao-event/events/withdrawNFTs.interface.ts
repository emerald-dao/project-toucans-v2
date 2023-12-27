import type { BaseEvent } from './common/base-event.interface';

export interface WithdrawNFTsEvent extends BaseEvent {
	type: 'WithdrawNFTs';
	data: {
		to: string;
		amount: string;
		tokenSymbol: string;
		currentCycle: string | null;
	};
}
