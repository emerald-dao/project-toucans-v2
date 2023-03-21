import type { ActionData } from '$lib/types/dao-project/dao-project.interface';

export interface ProjectNotifications {
	[danName: string]: {
		actions: ActionData[];
		isSigner: boolean;
		threshold: string;
	};
}
