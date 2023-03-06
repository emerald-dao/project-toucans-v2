import { createActiveStep } from '$stores/custom/steps/ActiveStep';
import { createSteps } from '$stores/custom/steps/Steps';
import { newRoundExecution } from '$flow/actions';
import GeneralData from '../components/steps/2-general-data/GeneralData.svelte';
import Duration from '../components/steps/1-duration/Duration.svelte';
import Distribution from '../components/steps/3-distribution/Distribution.svelte';

const onLaunchRound = async () => {
	newRoundExecution();
};

export const roundGeneratorSteps = createSteps([
	{
		name: 'Duration',
		component: Duration,
		action: null,
		form: false,
		state: 'active'
	},
	{
		name: 'GeneralData',
		component: GeneralData,
		action: null,
		form: false,
		state: 'active'
	},
	{
		name: 'Distribution',
		component: Distribution,
		action: onLaunchRound,
		form: false,
		state: 'inactive'
	}
]);
export const newRoundActiveStep = createActiveStep(roundGeneratorSteps);
