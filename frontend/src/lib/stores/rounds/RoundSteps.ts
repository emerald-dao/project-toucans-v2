import { createActiveStep } from '$stores/steps/ActiveStep';
import { createSteps } from '$stores/steps/Steps';
import { dummyTransactionExecution } from '$flow/actions';
import GeneralInfo from '../../../../src/routes/admin/rounds/components/steps/GeneralInfo.svelte';
import Distribution from '../../../../src/routes/admin/rounds/components/steps/Distribution.svelte';

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
		action: dummyTransactionExecution,
		form: false,
		state: 'inactive'
	}
]);
export const newRoundActiveStep = createActiveStep(newRoundSteps);
