import { createActiveStep } from '$stores/custom/steps/ActiveStep';
import { createSteps } from '$stores/custom/steps/Steps';
import { fundProjectExecution } from '$flow/actions';
import Disclaimer from '../../features/funding/funding-steps/Disclaimer.svelte';
import Fund from '../../features/funding/funding-steps/Fund.svelte';
import Thanks from '../../features/funding/funding-steps/Thanks.svelte';

export const fundingSteps = createSteps([
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
export const fundActiveStep = createActiveStep(fundingSteps);
