import { page } from '$app/stores';
import type { ActionExecutionResult } from '$stores/custom/steps/step.interface';
import { user } from '$stores/flow/FlowStore';
import { postVotingRound } from '$lib/features/voting-rounds/api/postVotingRound';
import { resetVotingGeneratorStores, votingGeneratorData } from '../_config/votingGeneratorData';
import { get } from 'svelte/store';
import { invalidate } from '$app/navigation';

export const createVotingRound = async (): Promise<ActionExecutionResult> => {
	const projectId = get(page).params.projectId;
	const userObj = get(user);
	const generatorData = get(votingGeneratorData);

	if (!projectId || !userObj) {
		return {
			state: 'error',
			errorMessage: 'Error creating voting round'
		};
	}

	const result = await postVotingRound(projectId, userObj, generatorData);

	if (result === 'success') {
		await invalidate('app:voting-rounds');
		resetVotingGeneratorStores();
	}

	return {
		state: result,
		errorMessage: result === 'success' ? '' : 'Error creating voting round'
	};
};
