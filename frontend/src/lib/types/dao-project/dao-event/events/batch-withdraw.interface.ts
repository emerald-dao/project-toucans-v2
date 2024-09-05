import type { BaseEvent } from '$lib/utilities/api/supabase/fetchProjectEvents';

export interface BatchWithdrawEvent extends BaseEvent {
	type: 'BatchWithdraw';
	data: {
		amount: string;
		tokenSymbol: string;
		currentCycle: string | null;
		amounts: { [address: string]: string };
	};
}
