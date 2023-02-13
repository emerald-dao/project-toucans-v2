import { createActiveStep } from '$stores/steps/ActiveStep';
import { createSteps } from '$stores/steps/Steps';
import { dummyTransactionExecution, fundProjectExecution } from '$flow/actions';
import Disclaimer from '../../../../src/routes/[contractName]/components/funding-steps/Disclaimer.svelte';
import Fund from '../../../../src/routes/[contractName]/components/funding-steps/Fund.svelte';
import Thanks from '../../../../src/routes/[contractName]/components/funding-steps/Thanks.svelte';
import { get } from 'svelte/store';
import { fundData } from './FundDataStore';

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
