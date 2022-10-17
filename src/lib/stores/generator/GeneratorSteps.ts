import { createActiveStep } from '$stores/steps/ActiveStep';
import { createSteps } from '$stores/steps/Steps';
import { dummyTransactionExecution } from '$flow/actions';
import TokenType from '$components/pages/dao-generator/steps/TokenType.svelte';
import Tokenomics from '$components/pages/dao-generator/steps/Tokenomics.svelte';
import ReviewAndDeploy from '$components/pages/dao-generator/steps/ReviewAndDeploy.svelte';
import DaoDetails from '$components/pages/dao-generator/steps/DaoDetails.svelte';

export const generatorSteps = createSteps([
	{
		title: 'DAO Details',
		component: DaoDetails,
		action: null
	},
	{
		title: 'Token Type',
		component: TokenType,
		action: null
	},
	{
		title: 'Tokenomics',
		component: Tokenomics,
		action: null
	},
	{
		title: 'Review & Deploy',
		component: ReviewAndDeploy,
		action: dummyTransactionExecution
	}
]);
export const generatorActiveStep = createActiveStep(generatorSteps);
