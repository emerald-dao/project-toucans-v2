import { deployContractExecution } from '$flow/actions';
import { get } from 'svelte/store';
import { daoGeneratorData } from '$lib/features/dao-generator/stores/DaoGeneratorData';
import { user } from '$stores/flow/FlowStore';
import { NFTStorage } from 'nft.storage';
import { env as PublicEnv } from '$env/dynamic/public';
import { goto } from '$app/navigation';
import { generatorActiveStep } from '../stores/DaoGeneratorSteps';
import type { CurrentUserObject, TransactionStatusObject } from '@onflow/fcl';
import type { ProjectCreatedEvent } from '$lib/types/dao-project/dao-event/events/project-created.interface';
import { postProject } from '$lib/features/dao-generator/functions/postDao';
import { addNotification } from '$lib/features/notifications/functions/postNotification';
import { ECurrencies } from '../../../types/common/enums';
import type { ActionExecutionResult } from '$stores/custom/steps/step.interface';
import { restartAllSuites } from './restartAllSuites';

const NFT_STORAGE_TOKEN = PublicEnv.PUBLIC_NFT_STORAGE_KEY;
const client = new NFTStorage({ token: NFT_STORAGE_TOKEN });

export const deployDao = async () => {
	const projectData = get(daoGeneratorData);

	// After the contract is deployed to the blockchain, we upload images to IPFS and upload our data to the backend
	const actionAfterDeployment: (
		res: TransactionStatusObject
	) => Promise<ActionExecutionResult> = async (res: TransactionStatusObject) => {
		const [projectCreatedEvent] = res.events.filter((event) =>
			event.type.includes('Toucans.ProjectCreated')
		);
		const eventData = projectCreatedEvent.data as ProjectCreatedEvent;

		console.log('ProjectCreatedEvent', projectCreatedEvent);

		restartAllSuites();

		const uploadLogoToIPFS = async () => {
			if (projectData.daoDetails.logo) {
				const cid = await client.storeBlob(projectData.daoDetails.logo[0]);
				console.log('CID', cid);
				return `https://nftstorage.link/ipfs/${cid}`;
			} else {
				return '';
			}
		};

		const logo = await uploadLogoToIPFS();

		await postProject(get(user) as CurrentUserObject, projectData, eventData.projectId, logo);
		await addNotification(eventData.projectId, get(user).addr as string);
		await goto(`/discover/${projectData.daoDetails.contractName}`);

		generatorActiveStep.reset();
		daoGeneratorData.set({
			daoDetails: {
				name: '',
				tokenName: '',
				description: '',
				website: '',
				twitter: '',
				discord: 'https://discord.gg/',
				contractName: '',
				logo: undefined
			},
			tokenomics: {
				paymentCurrency: ECurrencies.FLOW,
				totalSupply: undefined,
				editDelay: '0.0',
				mintTokens: false,
				walletAddresses: []
			},
			multisig: {
				owner: '',
				addresses: [],
				threshold: 1
			}
		});

		return {
			state: 'success',
			errorMessage: ''
		};
	};

	const executionResult = await deployContractExecution(projectData, actionAfterDeployment);

	return executionResult;
};
