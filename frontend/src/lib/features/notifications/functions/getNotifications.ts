import { getPendingActions } from '$flow/actions';
import { supabase } from '$lib/supabaseClient';
import type { ProjectNotifications } from '../types/notifications.interface';

export const getNotifications: (userAddress: string) => Promise<ProjectNotifications> = async (
	userAddress
) => {
	const { data } = await supabase
		.from('notifications')
		.select(
			`
            project_id,
            projects (
                owner
            )
        `
		)
		.eq('user_address', userAddress);

	// remove duplicates
	const projectIds: string[] = [];
	const projectOwners: string[] = [];
	if (data) {
		for (const notification of data) {
			const projectId = notification.project_id;

			const projectOwner = notification.projects?.owner;

			if (!projectIds.includes(projectId)) {
				projectIds.push(projectId);
				projectOwners.push(projectOwner);
			}
		}
	}

	if (projectIds.length === 0) {
		return [];
	}

	const notifications = await getPendingActions(userAddress, projectOwners, projectIds);

	return notifications;
};
