import type { BaseEvent } from './common/base-event.interface';

export interface DonateNFTsEvent extends BaseEvent {
	type: 'DonateNFT';
	data: {
		amount: string;
		message: string;
		projectOwner: string;
		tokenSymbol: string;
		currentCycle?: string | null;
		by: string;
	};
}
