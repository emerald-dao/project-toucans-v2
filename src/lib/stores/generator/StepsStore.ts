import type { Step } from '$lib/types/generator/generator-step.interface';
import type { StepState } from '$lib/types/generator/generator-step-state.type';
import { writable } from 'svelte/store';
import {
	TokenType,
	Tokenomics,
	ReviewAndDeploy,
	DaoDetails
} from '$components/sections/dao-generator/index';
import { dummyTransactionExecution } from '$flow/actions';

function createSteps(steps: Step[]) {
	const { subscribe, update } = writable(steps);

	function changeStepState(index: number, state: StepState) {
		update((steps) => {
			steps[index].state = state;
			return steps;
		});
	}

	function resetStates() {
		update((steps) => {
			for (let index = 0; index < steps.length; index++) {
				if (index === 0) {
					steps[index].state = 'active';
				} else {
					steps[index].state = 'inactive';
				}
			}
			return steps;
		});
	}

	return {
		subscribe,
		changeStepState,
		resetStates
	};
}

export const steps = createSteps([
	{
		title: 'DAO Details',
		component: DaoDetails,
		action: null,
		state: 'active'
	},
	{
		title: 'Token Type',
		component: TokenType,
		action: null,
		state: 'inactive'
	},
	{
		title: 'Tokenomics',
		component: Tokenomics,
		action: dummyTransactionExecution,
		state: 'inactive'
	},
	{
		title: 'Review & Deploy',
		component: ReviewAndDeploy,
		action: null,
		state: 'inactive'
	}
]);
