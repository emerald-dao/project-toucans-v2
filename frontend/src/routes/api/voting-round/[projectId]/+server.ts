import { createClient } from '@supabase/supabase-js';
import { env as PrivateEnv } from '$env/dynamic/private';
import { env as PublicEnv } from '$env/dynamic/public';
import { verifyAccountOwnership } from '$flow/utils.js';
import { json } from '@sveltejs/kit';
import type { CurrentUserObject } from '@onflow/fcl';
import type { Database } from '../../../../../supabase/database.types.js';
import type { VotingRoundData } from '../../../../lib/features/voting-rounds/types/voting-round-data.type.js';

const supabase = createClient<Database>(
	PublicEnv.PUBLIC_SUPABASE_URL,
	PrivateEnv.SUPABASE_SERVICE_KEY
);

export async function POST({ request, params }) {
	const requestData: {
		user: CurrentUserObject;
		votingRoundData: VotingRoundData;
	} = await request.json();

	const { user, votingRoundData } = requestData;
	const projectId = params.projectId;

	try {
		const verifyAccount = await verifyAccountOwnership(user);

		if (!verifyAccount) {
			return json({});
		}

		const { error: votingRoundsError, data: votingRound } = await supabase
			.from('voting_rounds')
			.insert({
				project_id: projectId,
				name: votingRoundData.name,
				description: votingRoundData.description,
				start_date: votingRoundData.startDate ? votingRoundData.startDate : null,
				end_date: votingRoundData.endDate,
				nft_mode: votingRoundData.nftMode,
				required_nft_collection_id: votingRoundData.requiredCollection[0],
				linked_action_id: votingRoundData.linkedAction?.id,
				linked_action_type: votingRoundData.linkedAction?.type
			})
			.select()
			.single();

		if (votingRoundsError || votingRound === null) {
			console.log('Error adding new voting round', votingRoundsError);

			return new Response(JSON.stringify({ error: 'Error creating voting round' }), {
				status: 500
			});
		}

		const votingOptionsData = votingRoundData.options.map((option, i) => {
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
				return new Response(JSON.stringify({ error: 'Error creating voting round' }), {
					status: 500
				});
			}

			return new Response(JSON.stringify({ error: 'Error creating voting options' }), {
				status: 500
			});
		}

		return json({ success: true });
	} catch (error) {
		console.log('Error creating voting round', error);

		return new Response(JSON.stringify({ error: 'Error creating voting round' }), {
			status: 500
		});
	}
}
