import type { VotingRound } from '$lib/utilities/api/supabase/fetchAllVotingRounds';
import type { CurrentUserObject } from '@onflow/fcl';
import type { VotingRoundStatus } from '../../../../p/[projectId]/voting-rounds/[votingRoundId]/_components/voting-widget/voting-round-status.type';

export const postVote = async (
	projectId: string,
	user: CurrentUserObject,
	votingRound: VotingRound,
	votingOptionId: number,
	votingRoundStatus: VotingRoundStatus,
	nftUuid: string | undefined
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
				nftUuid
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
