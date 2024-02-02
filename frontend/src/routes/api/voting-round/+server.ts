import { createClient } from '@supabase/supabase-js';
import { env as PrivateEnv } from '$env/dynamic/private';
import { env as PublicEnv } from '$env/dynamic/public';
import type { VotingNftModeSlugs } from '../../admin/[projectId]/voting/_components/steps/3-nft-mode/votingNftModes.js';
import { verifyAccountOwnership } from '$flow/utils.js';
import { json } from '@sveltejs/kit';
import type { CurrentUserObject } from '@onflow/fcl';
import type { Database } from '../../../../supabase/database.types.js';
import type { VotingOption } from '../../admin/[projectId]/voting/_components/steps/2-voting-options/voting-option.interface.js';

const supabase = createClient<Database>(
	PublicEnv.PUBLIC_SUPABASE_URL,
	PrivateEnv.SUPABASE_SERVICE_KEY
);

export async function POST({ request }) {
	const requestData: {
		user: CurrentUserObject;
		projectId: string;
		name: string;
		description?: string;
		startDate?: string;
		endDate?: string;
		nftMode: VotingNftModeSlugs;
		requiredCollection?: string;
		votingOptions: VotingOption[];
	} = await request.json();

	const {
		user,
		projectId,
		name,
		description,
		startDate,
		endDate,
		nftMode,
		requiredCollection,
		votingOptions
	} = requestData;

	const verifyAccount = await verifyAccountOwnership(user);
	if (!verifyAccount) {
		return json({});
	}

	const { error: votingRoundsError, data: votingRound } = await supabase
		.from('voting_rounds')
		.insert({
			project_id: projectId,
			name,
			description,
			start_date: startDate,
			end_date: endDate,
			nft_mode: nftMode,
			required_collection: requiredCollection
		})
		.select()
		.single();

	if (votingRoundsError || votingRound === null) {
		console.log('Error adding new voting round', votingRoundsError);
		return json({ error: 'Error creating voting round' });
	}

	const votingOptionsData = votingOptions.map((option, i) => {
		return {
			voting_round_id: votingRound.id,
			name: option.name,
			description: option.description,
			option_number: i + 1
		};
	});

	const { error: votingOptionsError } = await supabase
		.from('voting_options')
		.insert(votingOptionsData);

	if (votingOptionsError) {
		console.log('Error adding voting options', votingOptionsError);

		const { error: deleteVotingRoundError } = await supabase
			.from('voting_rounds')
			.delete()
			.match({ id: votingRound.id });

		if (deleteVotingRoundError) {
			console.log('Error deleting voting round', deleteVotingRoundError);
		}

		return json({ error: 'Error creating voting options' });
	}

	return json({ success: true });
}
