import { createActiveStep } from '$stores/custom/steps/ActiveStep';
import { createSteps } from '$stores/custom/steps/Steps';
import { newRoundExecution } from '$flow/actions';
import GeneralInfo from '$components/round-generator/steps/2-Generalnfo/GeneralInfo.svelte';
import Duration from '$components/round-generator/steps/1-Duration/Duration.svelte';
import Distribution from '$components/round-generator/steps/3-Distribution/Distribution.svelte';
import { roundGeneratorData } from './RoundGeneratorData';
import { get, type Writable } from 'svelte/store';
import { daoGeneratorData } from '../../dao-generator/stores/DaoGeneratorData';
import type { FinancialDaoGeneratorData } from '$lib/features/dao-generator/types/dao-generator-data.interface';

// When a launch round event occurs, we should check whether the generated round comes from the dao generator or the dao admin
// If it comes from the dao generator, the dao is not yet created, so we just save the roundData into the generator store.
// If it comes from the dao admin, the dao is already created, so we just execute de newRoundExecution action.
const onLaunchRound = async () => {
	if (get(roundGeneratorData).projectId != undefined) {
		newRoundExecution();
	} else {
		const daoGeneratorDataStore = daoGeneratorData as Writable<FinancialDaoGeneratorData>;

		daoGeneratorDataStore.update((data) => {
			return {
				...data,
				tokenomics: {
					...data.tokenomics,
					initialRound: get(roundGeneratorData)
				}
			};
		});
	}
};

export const roundGeneratorSteps = createSteps([
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
export const newRoundActiveStep = createActiveStep(roundGeneratorSteps);
