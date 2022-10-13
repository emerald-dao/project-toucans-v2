import { createActiveStep } from '$stores/steps/ActiveStep';
import { createSteps } from '$stores/steps/Steps';
import {
	TokenType,
	Tokenomics,
	ReviewAndDeploy,
	DaoDetails
} from '$components/pages/dao-generator/index';
import { dummyTransactionExecution } from '$flow/actions';

export const generatorSteps = createSteps([
	{
		title: 'DAO Details',
		component: DaoDetails,
		action: null,
		state: 'active'
	},
	{
		title: 'Token Type',
		component: TokenType,
		action: null,
		state: 'inactive'
	},
	{
		title: 'Tokenomics',
		component: Tokenomics,
		action: null,
		state: 'inactive'
	},
	{
		title: 'Review & Deploy',
		component: ReviewAndDeploy,
		action: dummyTransactionExecution,
		state: 'inactive'
	}
]);
export const generatorActiveStep = createActiveStep(generatorSteps);
