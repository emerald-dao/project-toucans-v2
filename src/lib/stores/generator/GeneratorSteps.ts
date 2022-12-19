import { createActiveStep } from '$stores/steps/ActiveStep';
import { createSteps } from '$stores/steps/Steps';
import { dummyTransactionExecution } from '$flow/actions';
import TokenType from '../../../routes/dao-generator/generate/components/generator-steps/TokenType.svelte';
import Tokenomics from '../../../routes/dao-generator/generate/components/generator-steps/Tokenomics.svelte';
import ReviewAndDeploy from '../../../routes/dao-generator/generate/components/generator-steps/ReviewAndDeploy.svelte';
import DaoDetails from '../../../routes/dao-generator/generate/components/generator-steps/DaoDetails.svelte';

export const generatorSteps = createSteps([
	{
		name: 'DAO Details',
		slug: 'daoDetailes',
		component: DaoDetails,
		action: null,
		form: true,
		state: 'active'
	},
	{
		name: 'Token Type',
		slug: 'tokenType',
		component: TokenType,
		action: null,
		form: true,
		state: 'inactive'
	},
	{
		name: 'Tokenomics',
		slug: 'tokenomics',
		component: Tokenomics,
		action: null,
		form: true,
		state: 'inactive'
	},
	{
		name: 'Review & Deploy',
		slug: 'review',
		component: ReviewAndDeploy,
		action: dummyTransactionExecution,
		form: false,
		state: 'inactive'
	}
]);
export const generatorActiveStep = createActiveStep(generatorSteps);
