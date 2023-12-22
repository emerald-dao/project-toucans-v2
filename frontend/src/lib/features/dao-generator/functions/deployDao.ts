import { deployContractExecution, deployDAONoTokenExecution } from '$flow/actions';
import { get } from 'svelte/store';
import { user } from '$stores/flow/FlowStore';
import { goto } from '$app/navigation';
import {
	daoGeneratorActiveStep,
	daoAndTokenGeneratorActiveStep
} from '../stores/DaoGeneratorSteps';
import type { CurrentUserObject, TransactionStatusObject } from '@onflow/fcl';
import { postProject } from '$lib/features/dao-generator/functions/postDao';
import { addNotification } from '$lib/features/notifications/functions/postNotification';
import type { ActionExecutionResult } from '$stores/custom/steps/step.interface';
import { restartAllSuites } from './restartAllSuites';
import { checkUser } from '$lib/features/users/functions/checkUser';
import { addUser } from '$lib/features/users/functions/postUser';
import uploadToIPFS from '$lib/utilities/uploadToIpfs';
import type { DaoGeneratorData } from '../types/dao-generator-data.interface';
import { daoGeneratorData, emptyDaoGeneratorData } from '../stores/DaoGeneratorData';
import {
	daoAndTokenGeneratorData,
	emptyDaoAndTokenGeneratorData
} from '../stores/DaoAndTokenGeneratorData';

export const deployDao = async (daoData: DaoGeneratorData) => {
	const logoIpfsUrl = await uploadToIPFS((daoData.daoDetails.logo as File[])[0]);
	const bannerImage = await uploadToIPFS((daoData.daoDetails.bannerImage as File[])[0]);
	daoData.daoDetails.logoIpfsUrl = logoIpfsUrl;
	daoData.daoDetails.bannerLogoIpfsUrl = bannerImage;

	// After the contract is deployed to the blockchain, we upload images to IPFS and upload our data to the backend
	const actionAfterDeployment: (
		res: TransactionStatusObject
	) => Promise<ActionExecutionResult> = async (res: TransactionStatusObject) => {
		const [projectCreatedEvent] = res.events.filter((event) =>
			event.type.includes('Toucans.ProjectCreated')
		);
		const eventData = projectCreatedEvent.data;

		console.log('ProjectCreatedEvent', projectCreatedEvent);

		restartAllSuites();

		// Add user to the users table if they don't exist
		const userExists = await checkUser(get(user) as CurrentUserObject);
		if (userExists) {
			console.log('User exists');
		} else {
			await addUser(get(user) as CurrentUserObject);
			console.log('User added');
		}

		await postProject(
			get(user) as CurrentUserObject,
			daoData,
			eventData.projectId,
			logoIpfsUrl,
			bannerImage
		);
		await addNotification(eventData.projectId, get(user).addr as string);
		await goto(`/p/${eventData.projectId}`);

		if (daoData.daoDetails.daoType === 'daoAndToken') {
			daoAndTokenGeneratorActiveStep.reset();
			daoGeneratorData.set(emptyDaoGeneratorData);
		} else if (daoData.daoDetails.daoType === 'daoOnly') {
			daoGeneratorActiveStep.reset();
			daoAndTokenGeneratorData.set(emptyDaoAndTokenGeneratorData);
		}

		return {
			state: 'success',
			errorMessage: ''
		};
	};

	let executionResult;

	if (daoData.daoDetails.daoType === 'daoAndToken') {
		executionResult = await deployContractExecution(daoData, actionAfterDeployment);
	} else if (daoData.daoDetails.daoType === 'daoOnly') {
		executionResult = await deployDAONoTokenExecution(daoData, actionAfterDeployment);
	}

	return executionResult;
};
