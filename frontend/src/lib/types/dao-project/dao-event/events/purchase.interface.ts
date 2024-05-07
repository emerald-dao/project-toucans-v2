import type { BaseEvent } from '$lib/utilities/api/supabase/fetchProjectEvents';

export interface PurchaseEvent extends BaseEvent {
	type: 'Purchase';
	data: {
		amount: string;
		message: string;
		projectOwner: string;
		tokenSymbol: string;
		currentCycle: string;
		by: string;
	};
}
