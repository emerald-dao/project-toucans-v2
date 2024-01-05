import type { BaseEvent } from './common/base-event.interface';

export interface DonateNFTsEvent extends BaseEvent {
	type: 'DonateNFT';
	data: {
		amount: string;
		message: string;
		contractName: string;
		contractAddress: string;
		projectOwner: string;
		by: string;
	};
}
