import type { BaseEvent } from '$lib/utilities/api/supabase/fetchProjectEvents';

export interface LockTokensEvent extends BaseEvent {
	type: 'LockTokens';
	data: {
		amount: string;
		tokenSymbol: string;
		currentCycle: string | null;
		recipient: string;
		unlockTime: string;
	};
}
