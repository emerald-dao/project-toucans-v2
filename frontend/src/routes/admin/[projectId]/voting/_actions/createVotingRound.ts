import { page } from '$app/stores';
import type { ActionExecutionResult } from '$stores/custom/steps/step.interface';
import { user } from '$stores/flow/FlowStore';
import { postVotingRound } from '../_api/postVotingRound';
import {
	resetVotingGeneratorStores,
	votingGeneratorData,
	votingGeneratorOptions
} from '../votingGeneratorData';
import { get } from 'svelte/store';

export const createVotingRound = async (): Promise<ActionExecutionResult> => {
	if (!get(page).params.projectId || !get(user)) {
		return {
			state: 'error',
			errorMessage: 'Error creating voting round'
		};
	}

	const result = await postVotingRound(
		get(page).params.projectId,
		get(user),
		get(votingGeneratorData)
	);

	if (result === 'success') {
		resetVotingGeneratorStores();
	}

	return {
		state: result,
		errorMessage: result === 'success' ? '' : 'Error creating voting round'
	};
};
