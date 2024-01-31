import { executeTransaction } from '$flow/utils';
import { resetVotingGeneratorStores } from './data';

export const createVotingRound = async () => {
	alert('TODO: createVotingRound');
	const transactionResult = await executeTransaction('transaction-code');

	if (transactionResult.state === 'success') {
		resetVotingGeneratorStores();
	}

	return transactionResult;
};
