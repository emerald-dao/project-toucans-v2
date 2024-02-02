import type { CurrentUserObject } from '@onflow/fcl';
import type { VotingOption } from '../_components/steps/2-voting-options/voting-option.interface';
import type { VotingNftModeSlug } from '../_components/steps/3-nft-mode/votingNftModes';

export const postVotingRound = async (
	projectId: string,
	user: CurrentUserObject,
	votingRoundData: VotingRoundData,
	votingOptions: VotingOption[]
) => {
	try {
		const response = await fetch(`/api/voting-round/${projectId}`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				user,
				votingOptions,
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

export type VotingRoundData = {
	name: string;
	description?: string;
	options: VotingOption[];
	nftMode: VotingNftModeSlug;
	requiredCollection: string[];
	hasTimeframe: boolean;
	startDate: Date;
	endDate?: Date;
};
