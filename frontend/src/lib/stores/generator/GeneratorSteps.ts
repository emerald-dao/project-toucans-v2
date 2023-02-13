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
import { NFTStorage } from 'nft.storage';
import { env as PublicEnv } from '$env/dynamic/public';
import { goto } from '$app/navigation';

const NFT_STORAGE_TOKEN = PublicEnv.PUBLIC_NFT_STORAGE_KEY;
const client = new NFTStorage({ token: NFT_STORAGE_TOKEN });

const createToken = async () => {
	const data = get(daoData);

	const action = async (res) => {
		console.log('Response', res);

		const [projectCreatedEvent] = res.events.filter((event) =>
			event.type.includes('Toucans.ProjectCreated')
		);
		const cid = await client.storeBlob(data.daoDetails.logo[0]);
		const logo = `https://nftstorage.link/ipfs/${cid}`;

		console.log('Project Created Event', projectCreatedEvent);

		const response = await fetch('/api/add', {
			method: 'POST',
			body: JSON.stringify({
				user: get(user),
				...data,
				logo,
				projectId: projectCreatedEvent.data.projectId
			}),
			headers: {
				'content-type': 'application/json'
			}
		}).then(() => {
			goto(`/${data.daoDetails.contractName}`);
		});
		console.log('Response', response);
	};

	deployContractExecution(data, action);
};

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
