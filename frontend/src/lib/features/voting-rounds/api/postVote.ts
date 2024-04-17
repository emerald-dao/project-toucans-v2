import type { VotingRoundStatus } from '$lib/features/voting-rounds/components/voting-widget/voting-round-status.type';
import type { VotingRound } from '$lib/utilities/api/supabase/fetchAllVotingRounds';
import type { CurrentUserObject } from '@onflow/fcl';

export const postVote = async (
	projectId: string,
	user: CurrentUserObject,
	votingRound: VotingRound,
	votingOptionId: number,
	votingRoundStatus: VotingRoundStatus,
	nftUuids: string[] | undefined,
	amountOfTokens: number | undefined,
	tokenContractAddress: string | null
) => {
	try {
		const response = await fetch(`/api/voting-round/${projectId}/${votingRound.id}/vote`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				user,
				votingRound,
				votingOptionId,
				votingRoundStatus,
				nftUuids,
				amountOfTokens,
				tokenContractAddress
			})
		});
		if (response.ok) {
			return 'success';
		}

		return 'error';
	} catch (error) {
		console.log('error', error);

		return 'error';
	}
};
