import { deployContractExecution } from '$flow/actions';
import { get } from 'svelte/store';
import { daoGeneratorData } from '$lib/features/dao-generator/stores/DaoGeneratorData';
import { user } from '$stores/flow/FlowStore';
import { goto } from '$app/navigation';
import { generatorActiveStep } from '../stores/DaoGeneratorSteps';
import type { CurrentUserObject, TransactionStatusObject } from '@onflow/fcl';
import { postProject } from '$lib/features/dao-generator/functions/postDao';
import { addNotification } from '$lib/features/notifications/functions/postNotification';
import { ECurrencies } from '../../../types/common/enums';
import type { ActionExecutionResult } from '$stores/custom/steps/step.interface';
import { restartAllSuites } from './restartAllSuites';
import { checkUser } from '$lib/features/users/functions/checkUser';
import { addUser } from '$lib/features/users/functions/postUser';
import uploadToIPFS from '$lib/utilities/uploadToIpfs';

export const deployDao = async () => {
	const projectData = get(daoGeneratorData);

	const logoIpfsUrl = await uploadToIPFS((projectData.daoDetails.logo as File[])[0]);
	const bannerImage = await uploadToIPFS((projectData.daoDetails.bannerImage as File[])[0]);

	projectData.daoDetails.logoIpfsUrl = logoIpfsUrl;
	projectData.daoDetails.bannerLogoIpfsUrl = bannerImage;

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
			projectData,
			eventData.projectId,
			logoIpfsUrl,
			bannerImage
		);
		await addNotification(eventData.projectId, get(user).addr as string);
		await goto(`/p/${projectData.daoDetails.contractName}`);

		generatorActiveStep.reset();
		daoGeneratorData.set({
			daoDetails: {
				name: '',
				tokenName: '',
				description: '',
				website: '',
				twitter: '',
				discord: '',
				contractName: '',
				logo: undefined,
				logoIpfsUrl: '',
				bannerImage: undefined,
				bannerLogoIpfsUrl: ''
			},
			tokenomics: {
				paymentCurrency: ECurrencies.FLOW,
				initialSupply: 0,
				editDelay: '0.0',
				mintTokens: true,
				walletAddresses: [],
				hasMaxSupply: false
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