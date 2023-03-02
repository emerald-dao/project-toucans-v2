import { deployContractExecution } from '$flow/actions';
import { get } from 'svelte/store';
import { daoGeneratorData } from '$lib/features/dao-generator/stores/DaoGeneratorData';
import { user } from '$stores/flow/FlowStore';
import { NFTStorage } from 'nft.storage';
import { env as PublicEnv } from '$env/dynamic/public';
import { goto } from '$app/navigation';
import { generatorActiveStep } from '../stores/DaoGeneratorSteps';
import { emptyDaoGeneratorData } from '../stores/DaoGeneratorData';
import type { TransactionStatusObject } from '@onflow/fcl';
import type { ProjectCreatedEvent } from '$lib/types/dao-project/dao-event/events/project-created.interface';
import { postProject } from '$lib/features/dao-generator/functions/postDao';

const NFT_STORAGE_TOKEN = PublicEnv.PUBLIC_NFT_STORAGE_KEY;
const client = new NFTStorage({ token: NFT_STORAGE_TOKEN });

export const deployDao = async () => {
	const projectData = get(daoGeneratorData);

	// After the contract is deployed to the blockchain, we upload images to IPFS and upload our data to the backend
	const actionAfterDeployment = async (res: TransactionStatusObject) => {
		const [projectCreatedEvent] = res.events.filter((event) =>
			event.type.includes('Toucans.ProjectCreated')
		);
		const eventData = projectCreatedEvent.data as ProjectCreatedEvent;

		console.log('ProjectCreatedEvent', projectCreatedEvent);

		let logoUrl: string | undefined = undefined;
		let cid: string;

		if (projectData.daoDetails.logo) {
			cid = await client.storeBlob(projectData.daoDetails.logo[0]);
			logoUrl = `https://nftstorage.link/ipfs/${cid}`;
			console.log('CID', cid);
		}

		postProject(get(user), projectData, eventData.projectId, logoUrl).then(() => {
			goto(`/${projectData.daoDetails.contractName}`);
			generatorActiveStep.reset();
			daoGeneratorData.set(emptyDaoGeneratorData);
		});
	};

	deployContractExecution(projectData, actionAfterDeployment);
};
