import type { VotingOption } from '../_components/steps/2-voting-options/voting-option.interface';
import type { VotingNftModeSlug } from '../_components/steps/3-nft-mode/votingNftModes';

export type VotingRoundData = {
	name: string;
	description?: string;
	options: VotingOption[];
	nftMode: VotingNftModeSlug;
	requiredCollection: string[];
	startDate?: string;
	endDate: string;
	linkedAction: string | null;
};
