import type { ActionData } from '$lib/types/dao-project/dao-project.interface';

export interface ProjectNotifications {
	[daoName: string]: ActionData[];
}
