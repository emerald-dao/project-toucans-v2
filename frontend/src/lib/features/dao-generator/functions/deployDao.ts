import { deployContractExecution } from '$flow/actions';
import { get } from 'svelte/store';
import { daoGeneratorData } from '$lib/features/dao-generator/stores/DaoGeneratorData';
import { user } from '$stores/flow/FlowStore';
import { NFTStorage } from 'nft.storage';
import { env as PublicEnv } from '$env/dynamic/public';
import { goto } from '$app/navigation';
import { generatorActiveStep } from '../stores/DaoGeneratorSteps';
import { emptyDaoGeneratorData } from '../stores/DaoGeneratorData';
import type { CurrentUserObject, TransactionStatusObject } from '@onflow/fcl';
import type { ProjectCreatedEvent } from '$lib/types/dao-project/dao-event/events/project-created.interface';
import { postProject } from '$lib/features/dao-generator/functions/postDao';
import { addNotification } from '$lib/features/notifications/functions/postNotification';

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

		postProject(get(user) as CurrentUserObject, projectData, eventData.projectId, logo).then(() => {
			goto(`/discover/${projectData.daoDetails.contractName}`).then(() => {
				generatorActiveStep.reset();
				daoGeneratorData.set(emptyDaoGeneratorData);
				addNotification(eventData.projectId, get(user).addr as string);
			});
		});
	};

	return deployContractExecution(projectData, actionAfterDeployment);
};
