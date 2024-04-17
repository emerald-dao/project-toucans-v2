import { createActiveStep } from '$stores/custom/steps/ActiveStep';
import { createSteps } from '$stores/custom/steps/Steps';
import { createVotingRound } from '../_actions/createVotingRound';
import VotingGeneralDataStep from '../_components/steps/1-general-data/VotingGeneralDataStep.svelte';
import VotingOptionsStep from '../_components/steps/2-voting-options/VotingOptionsStep.svelte';
import VotingModeStep from '../_components/steps/3-voting-mode/VotingModeStep.svelte';
import VotingActionLinkingStep from '../_components/steps/4-action-linking/VotingActionLinkingStep.svelte';
import VotingTimeframeStep from '../_components/steps/5-timeframe/VotingTimeframeStep.svelte';
import VotingThanksStep from '../_components/steps/6-thanks/VotingThanksStep.svelte';

export const votingGeneratorSteps = createSteps([
	{
		name: 'Voting information',
		description: 'Tell us the basic information about your vote.',
		component: VotingGeneralDataStep,
		action: null,
		form: true,
		isValid: false,
		state: 'active',
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
		name: 'Voting mode',
		description: 'Optionally require NFTs or fungible tokens to participate in the round.',
		component: VotingModeStep,
		action: null,
		form: false,
		state: 'inactive',
		button: {
			text: 'Next',
			icon: 'tabler:arrow-right'
		}
	},
	{
		name: 'Action linking',
		description: `Ask community members opinion about a treasury action.`,
		component: VotingActionLinkingStep,
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
		name: 'Voting round created',
		component: VotingThanksStep,
		action: null,
		form: false,
		state: 'inactive'
	}
]);

export const votingGeneratorActiveStep = createActiveStep(votingGeneratorSteps);
