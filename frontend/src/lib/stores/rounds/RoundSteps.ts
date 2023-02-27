import { createActiveStep } from '$stores/steps/ActiveStep';
import { createSteps } from '$stores/steps/Steps';
import { newRoundExecution } from '$flow/actions';
import GeneralInfo from '$components/round-generator/steps/GeneralInfo.svelte';
import Duration from '$components/round-generator/steps/Duration.svelte';
import Distribution from '$components/round-generator/steps/Distribution.svelte';
import { roundData } from './RoundData';
import { get, type Writable } from 'svelte/store';
import { daoGeneratorData } from '../generator/DaoDataStore';
import type { FinancialDaoGeneratorData } from '$lib/types/generator/dao-generator-data.interface';

// When a launch round event occurs, we should check whether the generated round comes from the dao generator or the dao admin
// If it comes from the dao generator, the dao is not yet created, so we just save the roundData into the generator store.
// If it comes from the dao admin, the dao is already created, so we just execute de newRoundExecution action.
const onLaunchRound = async () => {
	if (get(roundData).projectId != undefined) {
		newRoundExecution();
	} else {
		const daoGeneratorDataStore = daoGeneratorData as Writable<FinancialDaoGeneratorData>;

		daoGeneratorDataStore.update((data) => {
			return {
				...data,
				tokenomics: {
					...data.tokenomics,
					initialRound: get(roundData)
				}
			};
		});
	}
};

export const newRoundSteps = createSteps([
	{
		name: 'Duration',
		component: Duration,
		action: null,
		form: false,
		state: 'active'
	},
	{
		name: 'GeneralInfo',
		component: GeneralInfo,
		action: null,
		form: false,
		state: 'active'
	},
	{
		name: 'Distribution',
		component: Distribution,
		action: onLaunchRound,
		form: false,
		state: 'inactive'
	}
]);
export const newRoundActiveStep = createActiveStep(newRoundSteps);
