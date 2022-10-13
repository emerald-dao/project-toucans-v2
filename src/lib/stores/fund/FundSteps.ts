import { createActiveStep } from '$stores/steps/ActiveStep';
import { createSteps } from '$stores/steps/Steps';
import { Disclaimer, Thanks, Fund } from '$components/pages/project/index';
import { dummyTransactionExecution } from '$flow/actions';

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
