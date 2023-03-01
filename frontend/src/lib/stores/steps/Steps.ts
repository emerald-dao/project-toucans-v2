import type { Step } from '$lib/types/dao-generator/generator-step.interface';
import type { ProgressStates } from '@emerald-dao/component-library/components/ProgressStep/progress-states.type';
import { writable } from 'svelte/store';

export function createSteps(steps: Step[]) {
	steps.forEach((step, index) => {
		index > 0 ? (step.state = 'inactive') : (step.state = 'active');
	});

	const { subscribe, update } = writable(steps);

	function changeStepState(index: number, state: ProgressStates) {
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
