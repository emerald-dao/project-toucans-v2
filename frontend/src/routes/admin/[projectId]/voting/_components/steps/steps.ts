import GeneralData from './1-general-data/GeneralData.svelte';
import { createActiveStep } from '$stores/custom/steps/ActiveStep';
import { createSteps } from '$stores/custom/steps/Steps';
import Jaja from './Jaja.svelte';
import Options from './2-voting-options/VotingOptions.svelte';

export const votingGeneratorSteps = createSteps([
	{
		name: 'Voting information',
		description: 'Tell us the basic information about your round',
		component: GeneralData,
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
		component: Options,
		action: null,
		form: false,
		isValid: false,
		state: 'active',
		button: {
			text: 'Next',
			icon: 'tabler:arrow-right'
		}
	},
	{
		name: 'Required NFTs',
		description: 'Optionally require an NFT to participate in the round',
		component: Jaja,
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
		component: Jaja,
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
		component: Jaja,
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
