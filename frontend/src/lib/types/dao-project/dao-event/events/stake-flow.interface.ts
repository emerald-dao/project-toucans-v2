import type { BaseEvent } from '$lib/utilities/api/supabase/fetchProjectEvents';

export interface StakeFlowEvent extends BaseEvent {
	type: 'StakeFlow';
	data: {
		amountIn: string;
		amountOut: string;
	};
}
