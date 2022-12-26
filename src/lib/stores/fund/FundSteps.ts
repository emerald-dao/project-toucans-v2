import { createActiveStep } from '$stores/steps/ActiveStep';
import { createSteps } from '$stores/steps/Steps';
import { dummyTransactionExecution } from '$flow/actions';
import Disclaimer from '../../../../src/routes/discover/[project]/components/funding-steps/Disclaimer.svelte';
import Fund from '../../../../src/routes/discover/[project]/components/funding-steps/Fund.svelte';
import Thanks from '../../../../src/routes/discover/[project]/components/funding-steps/Thanks.svelte';

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
		action: null,
		form: false,
		state: 'inactive'
	},
	{
		name: 'Thank You!',
		component: Thanks,
		action: dummyTransactionExecution,
		form: false,
		state: 'inactive'
	}
]);
export const fundActiveStep = createActiveStep(fundSteps);
