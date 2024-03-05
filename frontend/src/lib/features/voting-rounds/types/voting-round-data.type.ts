import type { VotingOption } from './voting-option.interface';
import type { VotingNftModeSlug } from '../constants/votingNftModes';

export type VotingRoundData = {
	name: string;
	description?: string;
	options: VotingOption[];
	nftMode: VotingNftModeSlug;
	requiredCollection: string[];
	startDate?: string;
	endDate: string;
	linkedAction: {
		type: string;
		id: string;
	} | null;
};
