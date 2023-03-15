import { supabase } from '$lib/supabaseClient';
import type { CurrentUserObject } from '@onflow/fcl';

export const checkUser = async (user: CurrentUserObject) => {
	const { data } = await supabase
		.from('users')
		.select(
			`
        address
      `
		)
		.eq('address', user.addr);

	if (data && data.length > 0) {
		return true;
	} else {
		return false;
	}
};
