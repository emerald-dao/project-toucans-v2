import type { CurrentUserObject } from '@onflow/fcl';
import type { VotingRoundData } from '../types/voting-round-data.type';

export const postVotingRound = async (
	projectId: string,
	user: CurrentUserObject,
	votingRoundData: VotingRoundData
) => {
	try {
		const response = await fetch(`/api/voting-round/${projectId}`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				user,
				votingRoundData
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
