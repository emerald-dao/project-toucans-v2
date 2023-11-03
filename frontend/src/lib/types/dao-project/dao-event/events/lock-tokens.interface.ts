import type { BaseEvent } from './common/base-event.interface';

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
