import type { BaseEvent } from '$lib/utilities/api/supabase/fetchProjectEvents';

export interface DonateNFTsEvent extends BaseEvent {
	type: 'DonateNFT';
	data: {
		amount: string;
		message: string;
		collectionIdentifier: string;
		collectionName: string;
		collectionExternalURL: string;
		projectOwner: string;
		by: string;
		uuids: string[];
	};
}
