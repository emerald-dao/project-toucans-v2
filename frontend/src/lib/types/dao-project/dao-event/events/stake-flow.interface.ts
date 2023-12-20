import type { BaseEvent } from './common/base-event.interface';

export interface StakeFlowEvent extends BaseEvent {
	type: 'StakeFlow';
	data: {
		amountIn: string;
		amountOut: string;
	};
}
