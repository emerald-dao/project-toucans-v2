import { createActiveStep } from '$stores/custom/steps/ActiveStep';
import { createSteps } from '$stores/custom/steps/Steps';
import GeneralData from '../components/steps/2-general-data/GeneralData.svelte';
import Duration from '../components/steps/1-duration/Duration.svelte';
import Distribution from '../components/steps/3-distribution/Distribution.svelte';
import Thanks from '../components/steps/4-thanks/Thanks.svelte';
import { launchRound } from '../functions/launchRound';

export const roundGeneratorSteps = createSteps([
	{
		name: 'Duration',
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
		name: 'Distribution',
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
