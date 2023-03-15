import { supabase } from '$lib/supabaseClient';
import type { CurrentUserObject } from '@onflow/fcl';

export const checkSubscription = async (projectId: string, user: CurrentUserObject) => {
	const { data } = await supabase
		.from('notifications')
		.select(
			`
        user_address,
				project_id
      `
		)
		.eq('user_address', user.addr)
		.eq('project_id', projectId);

	if (data && data.length > 0) {
		return true;
	} else {
		return false;
	}
};
