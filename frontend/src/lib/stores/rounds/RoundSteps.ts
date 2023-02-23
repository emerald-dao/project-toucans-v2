import { createActiveStep } from '$stores/steps/ActiveStep';
import { createSteps } from '$stores/steps/Steps';
import { newRoundExecution } from '$flow/actions';
import GeneralInfo from '$components/round-generator/steps/GeneralInfo.svelte';
import Duration from '$components/round-generator/steps/Duration.svelte';
import Distribution from '$components/round-generator/steps/Distribution.svelte';

export const newRoundSteps = createSteps([
	{
		name: 'Duration',
		component: Duration,
		action: null,
		form: false,
		state: 'active'
	},
	{
		name: 'GeneralInfo',
		component: GeneralInfo,
		action: null,
		form: false,
		state: 'active'
	},
	{
		name: 'Distribution',
		component: Distribution,
		action: newRoundExecution,
		form: false,
		state: 'inactive'
	}
]);
export const newRoundActiveStep = createActiveStep(newRoundSteps);
