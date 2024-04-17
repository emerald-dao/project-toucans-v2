import { createClient } from '@supabase/supabase-js';
import type { Database } from '../../../../../supabase/database.types.js';
import { env as PrivateEnv } from '$env/dynamic/private';
import { env as PublicEnv } from '$env/dynamic/public';
import type { CurrentUserObject } from '@onflow/fcl';
import { verifyAccountOwnership } from '$flow/utils.js';
import { fail } from '@sveltejs/kit';

const supabase = createClient<Database>(
	PublicEnv.PUBLIC_SUPABASE_URL,
	PrivateEnv.SUPABASE_SERVICE_KEY
);

export const actions = {
	deleteVotingRound: async ({ request }) => {
		const data = await request.formData();

		const votingRoundId = data.get('voting-round-id') as number | null;
		const daoSigners = data.get('dao-signers') as string[] | null;
		const user = data.get('user') as string | null;

		if (user === null) {
			console.log('User not found');
			return fail(400, { error: 'User not found' });
		}

		const userObject = JSON.parse(user) as CurrentUserObject;

		if (userObject.addr === undefined) {
			console.log('User address not found');
			return fail(400, { error: 'User address not found' });
		}

		const userIsAdmin = daoSigners?.includes(userObject.addr);

		if (!userIsAdmin) {
			console.log('User is not an admin');
			return fail(400, { error: 'User is not an admin' });
		}

		const verifyAccount = await verifyAccountOwnership(userObject);

		if (!verifyAccount) {
			console.log('User not verified');
			return fail(400, { error: 'User not verified' });
		}

		const { error } = await supabase.from('voting_rounds').delete().match({ id: votingRoundId });

		if (error) {
			console.log('Error deleting voting round', error);
			return fail(500, { error: 'Error deleting voting round' });
		}

		return { success: true };
	}
};
