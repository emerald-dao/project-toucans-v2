import { createActiveStep } from '$stores/custom/steps/ActiveStep';
import { createSteps } from '$stores/custom/steps/Steps';
import { fundProjectExecution } from '$flow/actions';
import Disclaimer from '../components/steps/1-disclaimer/Disclaimer.svelte';
import Fund from '../components/steps/2-fund/Fund.svelte';
import Thanks from '../components/steps/3-thanks/Thanks.svelte';
import { fundingData } from './FundingData';
import { get } from 'svelte/store';

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
		action: () => fundProjectExecution(
			get(fundingData).daoAddress,
			get(fundingData).projectId,
			get(fundingData).amount,
			get(fundingData).specialMessage,
			get(fundingData).currency
		),
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
