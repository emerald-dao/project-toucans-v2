import { createClient } from '@supabase/supabase-js';
import { env as PrivateEnv } from '$env/dynamic/private';
import { env as PublicEnv } from '$env/dynamic/public';
import { verifyAccountOwnership } from '$flow/utils.js';
import { json } from '@sveltejs/kit';
import type { CurrentUserObject } from '@onflow/fcl';
import type { Database } from '../../../../../../../supabase/database.types.js';
import type { VotingRound } from '$lib/utilities/api/supabase/fetchAllVotingRounds.js';
import type { VotingRoundStatus } from '$lib/features/voting-rounds/components/voting-widget/voting-round-status.type';
import { getUserVotingEligibility } from '$lib/features/voting-rounds/utils/getUserVotingEligibility';

const supabase = createClient<Database>(
	PublicEnv.PUBLIC_SUPABASE_URL,
	PrivateEnv.SUPABASE_SERVICE_KEY
);

export async function POST({ request, params }) {
	const requestData: {
		user: CurrentUserObject;
		votingRound: VotingRound;
		votingOptionId: number;
		votingRoundStatus: VotingRoundStatus;
		nftUuids: string[] | undefined;
		amountOfTokens: number | undefined;
		tokenContractAddress: string | null;
	} = await request.json();

	const { user, votingOptionId, nftUuids, amountOfTokens, tokenContractAddress } = requestData;
	const votingRoundId = params.votingRoundId;

	try {
		const verifyAccount = await verifyAccountOwnership(user);

		if (!verifyAccount) {
			return json({});
		}

		if (user.addr === undefined) {
			return json({});
		}

		const userElegibility = await getUserVotingEligibility(
			user.addr,
			requestData.votingRound,
			requestData.votingRoundStatus,
			null,
			tokenContractAddress
		);

		if (!userElegibility.eligible) {
			return json({ error: userElegibility.reason });
		}

		const { error: voteError } = await supabase
			.from('votes')
			.insert({
				voting_round_id: Number(votingRoundId),
				selected_option: Number(votingOptionId),
				nft_uuids: nftUuids,
				wallet_address: user.addr,
				amount_of_tokens: amountOfTokens ?? null
			})
			.select()
			.single();

		if (voteError) {
			console.log('Error voting', voteError);
			return new Response(JSON.stringify({ error: 'Error voting' }), {
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
