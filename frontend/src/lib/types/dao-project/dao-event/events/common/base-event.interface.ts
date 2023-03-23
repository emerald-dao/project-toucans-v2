import type { DaoEventName } from '../../dao-event.type';

export interface BaseEvent {
	project_id: string;
	id: number;
	type: DaoEventName;
	timestamp: string;
}
