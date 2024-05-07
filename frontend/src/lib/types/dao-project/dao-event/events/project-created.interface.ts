import type { BaseEvent } from '$lib/utilities/api/supabase/fetchProjectEvents';

export interface ProjectCreatedEvent extends BaseEvent {
	type: 'ProjectCreated';
	data: {
		tokenTypeIdentifier: string;
		by: string;
	};
}
