import type { VotingOption } from './voting-option.interface';
import type { VotingModeSlug } from '../constants/VOTING_MODES';

export type VotingRoundData = {
	name: string;
	description?: string;
	options: VotingOption[];
	nftMode: VotingModeSlug;
	requiredCollection: string[];
	startDate?: string;
	endDate: string;
	linkedAction: {
		type: string;
		id: string;
	} | null;
};
