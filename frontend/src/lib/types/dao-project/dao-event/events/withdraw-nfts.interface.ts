import type { BaseEvent } from '$lib/utilities/api/supabase/fetchProjectEvents';

export interface WithdrawNFTsEvent extends BaseEvent {
	type: 'WithdrawNFTs';
	data: {
		to: string;
		amount: string;
		collectionIdentifier: string;
		collectionName: string;
		collectionExternalURL: string;
		projectOwner: string;
		message: string;
	};
}
