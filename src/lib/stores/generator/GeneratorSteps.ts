import { createActiveStep } from '$stores/steps/ActiveStep';
import { createSteps } from '$stores/steps/Steps';
import { deployContractExecution, dummyTransactionExecution } from '$flow/actions';
import TokenType from '../../../routes/dao-generator/generate/components/generator-steps/TokenType.svelte';
import Tokenomics from '../../../routes/dao-generator/generate/components/generator-steps/Tokenomics.svelte';
import ReviewAndDeploy from '../../../routes/dao-generator/generate/components/generator-steps/ReviewAndDeploy.svelte';
import DaoDetails from '../../../routes/dao-generator/generate/components/generator-steps/DaoDetails.svelte';
import { get } from 'svelte/store';
import { daoData } from '$stores/generator/DaoDataStore';
import { user } from '$stores/flow/FlowStore';

const createToken = async () => {
	const data = get(daoData);
	data.daoDetails.contractName = data.daoDetails.name.replace(/\s+/g, "");
	const action = async () => {
		const response = await fetch('/api/add', {
			method: 'POST',
			body: JSON.stringify({ user: get(user), ...data }),
			headers: {
				'content-type': 'application/json'
			}
		});
		console.log('Response', response);
	}
	deployContractExecution(data, action);
}

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
		action: createToken,
		form: false,
		state: 'inactive'
	}
]);
export const generatorActiveStep = createActiveStep(generatorSteps);
