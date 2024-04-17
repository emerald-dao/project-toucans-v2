import type { BaseEvent } from '$lib/utilities/api/supabase/fetchProjectEvents';

export interface BatchMintEvent extends BaseEvent {
	type: 'BatchMint';
	data: {
		amount: string;
		tokenSymbol: string;
		currentCycle: string | null;
		amounts: { [address: string]: string };
	};
}
