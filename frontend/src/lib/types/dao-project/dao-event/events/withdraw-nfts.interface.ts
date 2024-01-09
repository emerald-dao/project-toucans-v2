import type { BaseEvent } from './common/base-event.interface';

export interface WithdrawNFTsEvent extends BaseEvent {
	type: 'WithdrawNFTs';
	data: {
		to: string;
		amount: string;
		collectionIdentifier: string;
		collectionName: string;
		collectionExternalURL: string;
		projectOwner: string;
	};
}
