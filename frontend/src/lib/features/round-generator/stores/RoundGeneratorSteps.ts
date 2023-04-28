import { createActiveStep } from '$stores/custom/steps/ActiveStep';
import { createSteps } from '$stores/custom/steps/Steps';
import GeneralData from '../components/steps/2-general-data/GeneralData.svelte';
import Duration from '../components/steps/1-duration/Duration.svelte';
import Distribution from '../components/steps/3-distribution/Distribution.svelte';
import Thanks from '../components/steps/5-thanks/Thanks.svelte';
import RequireNft from '../components/steps/4-require-nft/RequireNft.svelte';
import { launchRound } from '../functions/launchRound';

export const roundGeneratorSteps = createSteps([
	{
		name: 'Duration',
		description: 'Set the duration of the round',
		component: Duration,
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
		name: 'Conditions',
		description: 'Set general conditions of the round',
		component: GeneralData,
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
		name: 'Require NFT',
		description: 'Optionally require an NFT to participate in the round',
		component: RequireNft,
		action: null,
		form: false,
		state: 'inactive',
		button: {
			text: 'Next',
			icon: 'tabler:arrow-right'
		}
	},
	{
		name: 'Distribution',
		description:
			'Set how to distribute the funds. Funds will be automatically distributed to the addresses selected here. If no addresses are selected, the funds will be stored in the treasury wallet.',
		component: Distribution,
		action: () => launchRound(),
		form: false,
		state: 'inactive',
		button: {
			text: 'Launch round',
			icon: 'tabler:arrow-right'
		}
	},
	{
		name: 'Thank You!',
		component: Thanks,
		action: null,
		form: false,
		state: 'inactive'
	}
]);
export const newRoundActiveStep = createActiveStep(roundGeneratorSteps);
