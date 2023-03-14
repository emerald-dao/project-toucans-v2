
import { getPendingActionsInMany } from '$flow/actions';
import { supabase } from '$lib/supabaseClient';

export const getNotifications = async (userAddress: string) => {
    const { data } = await supabase
        .from('notifications')
        .select()
        .eq('user_address', userAddress);

    const [info] = data || [];
    console.log(info)

    // remove duplicates
    const projectIds: string[] = [];
    const projectOwners: string[] = [];
    for (var i = 0; i < info.project_ids.length; i++) {
        const projectId = info.project_ids[i];
        const projectOwner = info.project_owners[i];
        if (!projectIds.includes(projectId)) {
            projectIds.push(projectId);
            projectOwners.push(projectOwner);
        }
    }

    const notifications = await getPendingActionsInMany(userAddress, projectOwners, projectIds);
    console.log(notifications);
    return notifications;
};
