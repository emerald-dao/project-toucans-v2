import { createActiveStep } from '$stores/steps/ActiveStep';
import { createSteps } from '$stores/steps/Steps';
import { fundProjectExecution } from '$flow/actions';
import Disclaimer from '../../../routes/[contractName]/__components/funding-steps/Disclaimer.svelte';
import Fund from '../../../routes/[contractName]/__components/funding-steps/Fund.svelte';
import Thanks from '../../../routes/[contractName]/__components/funding-steps/Thanks.svelte';

export const fundSteps = createSteps([
	{
		name: 'Disclaimer',
		component: Disclaimer,
		action: null,
		form: false,
		state: 'active'
	},
	{
		name: 'Fund',
		component: Fund,
		action: fundProjectExecution,
		form: false,
		state: 'inactive'
	},
	{
		name: 'Thank You!',
		component: Thanks,
		action: null,
		form: false,
		state: 'inactive'
	}
]);
export const fundActiveStep = createActiveStep(fundSteps);
