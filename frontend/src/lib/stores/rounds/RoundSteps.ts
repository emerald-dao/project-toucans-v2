import { createActiveStep } from '$stores/steps/ActiveStep';
import { createSteps } from '$stores/steps/Steps';
import { newRoundExecution } from '$flow/actions';
import GeneralInfo from '../../../routes/admin/rounds/__components/steps/GeneralInfo.svelte';
import Distribution from '../../../routes/admin/rounds/__components/steps/Distribution.svelte';

export const newRoundSteps = createSteps([
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
