import type { BaseEvent } from '$lib/utilities/api/supabase/fetchProjectEvents';

export interface DonateEvent extends BaseEvent {
	type: 'Donate';
	data: {
		amount: string;
		message: string;
		projectOwner: string;
		tokenSymbol: string;
		currentCycle?: string | null;
		by: string;
	};
}
