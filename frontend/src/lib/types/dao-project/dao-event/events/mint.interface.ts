import type { BaseEvent } from '$lib/utilities/api/supabase/fetchProjectEvents';

export interface MintEvent extends BaseEvent {
	type: 'Mint';
	data: {
		to: string;
		amount: string;
		tokenSymbol: string;
		currentCycle: string | null;
	};
}
