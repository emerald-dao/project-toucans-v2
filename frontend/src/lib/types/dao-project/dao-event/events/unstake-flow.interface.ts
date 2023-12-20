import type { BaseEvent } from './common/base-event.interface';

export interface UnstakeFlowEvent extends BaseEvent {
	type: 'UnstakeFlow';
	data: {
		amountIn: string;
		amountOut: string;
	};
}
