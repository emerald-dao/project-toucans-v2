import type { BaseEvent } from './common/base-event.interface';

export interface ProjectCreatedEvent extends BaseEvent {
	type: 'ProjectCreated';
	data: {
		tokenTypeIdentifier: string;
		by: string;
	};
}
