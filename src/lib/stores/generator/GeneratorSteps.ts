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