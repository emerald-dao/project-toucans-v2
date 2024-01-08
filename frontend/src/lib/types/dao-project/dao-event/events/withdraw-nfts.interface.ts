import type { BaseEvent } from './common/base-event.interface';

export interface WithdrawNFTsEvent extends BaseEvent {
	type: 'WithdrawNFTs';
	data: {
		to: string;
		amount: string;
		contractName: string;
		contractAddress: string;
		projectOwner: string;
	};
}
