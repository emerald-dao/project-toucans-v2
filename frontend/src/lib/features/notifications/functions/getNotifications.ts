import { getPendingActionsInMany } from '$flow/actions';
import { supabase } from '$lib/supabaseClient';

export const getNotifications = async (userAddress: string) => {
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
			const projectOwner = notification.projects.owner;
			if (!projectIds.includes(projectId)) {
				projectIds.push(projectId);
				projectOwners.push(projectOwner);
			}
		}
	}

	const notifications = await getPendingActionsInMany(userAddress, projectOwners, projectIds);
	console.log(notifications);
	return {};
};
