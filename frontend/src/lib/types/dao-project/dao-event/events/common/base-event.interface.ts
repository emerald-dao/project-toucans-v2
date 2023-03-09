import type { Address } from '@onflow/fcl';
import type { DaoEventName } from '../../dao-event.type';

export interface BaseEvent {
	projectId: string;
	by: Address;
	tokenType: string;
	type: DaoEventName;
	timestamp: number;
	currentCycle: string;
}
