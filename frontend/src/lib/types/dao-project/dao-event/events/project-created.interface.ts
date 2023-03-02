import type { BaseEvent } from './common/base-event.interface';

export interface ProjectCreatedEvent extends BaseEvent {
	type: 'ProjectCreated';
	by: string;
}
