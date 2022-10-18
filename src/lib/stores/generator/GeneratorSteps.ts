import { createActiveStep } from '$stores/steps/ActiveStep';
import { createSteps } from '$stores/steps/Steps';
import { dummyTransactionExecution } from '$flow/actions';
import TokenType from '../../../../src/routes/dao-generator/components/generator-steps/TokenType.svelte';
import Tokenomics from '../../../../src/routes/dao-generator/components/generator-steps/Tokenomics.svelte';
import ReviewAndDeploy from '../../../../src/routes/dao-generator/components/generator-steps/ReviewAndDeploy.svelte';
import DaoDetails from '../../../../src/routes/dao-generator/components/generator-steps/DaoDetails.svelte';

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
