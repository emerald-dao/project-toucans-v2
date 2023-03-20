import { newRoundExecution } from '$flow/actions';

export const launchRound = async () => {
	const executionResult = await newRoundExecution();

	return executionResult;
};
