import type { BaseEvent } from '$lib/utilities/api/supabase/fetchProjectEvents';

export interface WithdrawEvent extends BaseEvent {
	type: 'Withdraw';
	data: {
		to: string;
		amount: string;
		tokenSymbol: string;
		currentCycle: string | null;
	};
}
