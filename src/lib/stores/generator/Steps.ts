// import { TestComponent1, TestComponent2, TestComponent3 } from '$atoms';
import type { Step } from '$lib/types/generator-step.interface';
import type { StepState } from '$lib/types/generator-step-state.type';
import type { StepsStore } from '$lib/types/generator-steps-store.interface';
import { writable } from 'svelte/store';
import { Card } from '$atoms';

function createSteps(steps: Step[]): StepsStore {
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
		title: 'First Step',
		component: Card,
		state: 'active'
	},
	{
		title: 'Second Step',
		component: Card,
		state: 'inactive'
	},
	{
		title: 'Third Step',
		component: Card,
		state: 'inactive'
	}
]);
