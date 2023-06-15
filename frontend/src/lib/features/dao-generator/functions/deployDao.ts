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

	const executionResult = await deployContractExecution(projectData);

	// Add user to the users table if they don't exist
	const userExists = await checkUser(get(user) as CurrentUserObject);
	if (!userExists) {
		await addUser(get(user) as CurrentUserObject);
	}

	if (executionResult.state === 'success') {
		await postProject(
			get(user) as CurrentUserObject,
			projectData,
			projectData.daoDetails.contractName,
			logoIpfsUrl,
			bannerImage
		);
		await addNotification(projectData.daoDetails.contractName, get(user).addr as string);
		await goto(`/p/${projectData.daoDetails.contractName}`);
	}

	restartAllSuites();

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

	return executionResult;
};
