import { createActiveStep } from '$stores/custom/steps/ActiveStep';
import { createSteps } from '$stores/custom/steps/Steps';
import VotingGeneralDataStep from './1-general-data/VotingGeneralDataStep.svelte';
import VotingOptionsStep from './2-voting-options/VotingOptionsStep.svelte';
import VotingNftModeStep from './3-nft-mode/VotingNftModeStep.svelte';
import VotingRequiredNftsStep from './4-required-nfts/VotingRequiredNftsStep.svelte';
import VotingTimeframeStep from './5-timeframe/VotingTimeframeStep.svelte';
import VotingThanksStep from './6-thanks/VotingThanksStep.svelte';

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
		name: 'Nft mode',
		description: 'Select the NFT mode for your voting round.',
		component: VotingNftModeStep,
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
		component: VotingRequiredNftsStep,
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
		description:
			'Set how to distribute the funds. Funds will be automatically distributed to the addresses selected here. If no addresses are selected, the funds will be stored in the treasury wallet.',
		component: VotingTimeframeStep,
		action: null,
		form: false,
		state: 'inactive',
		button: {
			text: 'Launch round',
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
