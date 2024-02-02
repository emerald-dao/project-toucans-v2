import { createActiveStep } from '$stores/custom/steps/ActiveStep';
import { createSteps } from '$stores/custom/steps/Steps';
import VotingGeneralDataStep from './_components/steps/1-general-data/VotingGeneralDataStep.svelte';
import VotingOptionsStep from './_components/steps/2-voting-options/VotingOptionsStep.svelte';
import VotingNftModeStep from './_components/steps/3-nft-mode/VotingNftModeStep.svelte';
import VotingTimeframeStep from './_components/steps/4-timeframe/VotingTimeframeStep.svelte';
import VotingThanksStep from './_components/steps/5-thanks/VotingThanksStep.svelte';
import { createVotingRound } from './votingGeneratorActions';

export const votingGeneratorSteps = createSteps([
	{
		name: 'Voting information',
		description: 'Tell us the basic information about your round',
		component: VotingGeneralDataStep,
		action: null,
		form: true,
		isValid: false,
		state: 'inactive',
		button: {
			text: 'Next',
			icon: 'tabler:arrow-right'
		}
	},
	{
		name: 'Voting options',
		description: undefined,
		component: VotingOptionsStep,
		action: null,
		form: false,
		isValid: false,
		state: 'inactive',
		button: {
			text: 'Next',
			icon: 'tabler:arrow-right'
		}
	},
	{
		name: 'Required NFTs',
		description: 'Optionally require an NFT to participate in the round',
		component: VotingNftModeStep,
		action: null,
		form: false,
		state: 'inactive',
		button: {
			text: 'Next',
			icon: 'tabler:arrow-right'
		}
	},
	{
		name: 'Timeframe',
		description: `Select the timeframe for your voting round. You can't change this later.`,
		component: VotingTimeframeStep,
		action: () => createVotingRound(),
		form: false,
		state: 'inactive',
		button: {
			text: 'Create voting round',
			icon: 'tabler:arrow-right'
		}
	},
	{
		name: 'Thanks',
		description: 'Thanks for launching your round!',
		component: VotingThanksStep,
		action: null,
		form: false,
		state: 'inactive',
		button: {
			text: 'Next',
			icon: 'tabler:arrow-right'
		}
	}
]);

export const votingGeneratorActiveStep = createActiveStep(votingGeneratorSteps);
