import type { BaseEvent } from '$lib/utilities/api/supabase/fetchProjectEvents';

export interface UnstakeFlowEvent extends BaseEvent {
	type: 'UnstakeFlow';
	data: {
		amountIn: string;
		amountOut: string;
	};
}
