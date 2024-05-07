import type { BaseEvent } from '$lib/utilities/api/supabase/fetchProjectEvents';

export interface BurnEvent extends BaseEvent {
	type: 'Burn';
	data: {
		amount: string;
		tokenSymbol: string;
		currentCycle: string | null;
	};
}
