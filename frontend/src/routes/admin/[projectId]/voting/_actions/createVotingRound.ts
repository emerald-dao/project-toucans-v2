import { page } from '$app/stores';
import type { ActionExecutionResult } from '$stores/custom/steps/step.interface';
import { user } from '$stores/flow/FlowStore';
import { postVotingRound } from '$lib/features/voting-rounds/api/postVotingRound';
import { resetVotingGeneratorStores, votingGeneratorData } from '../_config/votingGeneratorData';
import { get } from 'svelte/store';
import { invalidate } from '$app/navigation';

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
		await invalidate((url) => {
			return url.pathname === `/admin/${get(page).params.projectId}/voting`;
		});
		resetVotingGeneratorStores();
	}

	return {
		state: result,
		errorMessage: result === 'success' ? '' : 'Error creating voting round'
	};
};
