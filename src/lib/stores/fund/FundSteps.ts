import { createActiveStep } from '$stores/steps/ActiveStep';
import { createSteps } from '$stores/steps/Steps';
import { dummyTransactionExecution } from '$flow/actions';
import Disclaimer from '$components/pages/project/funding-steps/Disclaimer.svelte';
import Fund from '$components/pages/project/funding-steps/Fund.svelte';
import Thanks from '$components/pages/project/funding-steps/Thanks.svelte';

export const fundSteps = createSteps([
	{
		title: 'Disclaimer',
		component: Disclaimer,
		action: null
	},
	{
		title: 'Fund',
		component: Fund,
		action: null
	},
	{
		title: 'Thank You!',
		component: Thanks,
		action: dummyTransactionExecution
	}
]);
export const fundActiveStep = createActiveStep(fundSteps);
