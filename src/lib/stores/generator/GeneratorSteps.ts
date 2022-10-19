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
		slug: 'daoDetailes',
		component: DaoDetails,
		action: null,
		form: true
	},
	{
		title: 'Token Type',
		slug: 'tokenType',
		component: TokenType,
		action: null,
		form: true
	},
	{
		title: 'Tokenomics',
		slug: 'tokenomics',
		component: Tokenomics,
		action: null,
		form: true
	},
	{
		title: 'Review & Deploy',
		slug: 'review',
		component: ReviewAndDeploy,
		action: dummyTransactionExecution,
		form: false
	}
]);
export const generatorActiveStep = createActiveStep(generatorSteps);
