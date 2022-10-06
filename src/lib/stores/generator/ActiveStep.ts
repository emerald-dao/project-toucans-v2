import { get, writable } from 'svelte/store';
import { steps } from '$stores/generator/StepsStore';

function createGeneratorActiveStep() {
	const { subscribe, set, update } = writable(0);

	async function increment() {
		const activeStepNumber = get(activeStep);
		const action = get(steps)[activeStepNumber].action;
		const numberOfSteps = get(steps).length;

		if (numberOfSteps - 1 > activeStepNumber) {
			if (action != null) {
				steps.changeStepState(activeStepNumber, 'loading');
				try {
					await action();
					steps.changeStepState(activeStepNumber, 'success');
					steps.changeStepState(activeStepNumber + 1, 'active');
					update((n) => n + 1);
				} catch (e) {
					console.error('Error has occured: ' + e);
					steps.changeStepState(activeStepNumber, 'error');
				}
			} else {
				steps.changeStepState(activeStepNumber, 'success');
				steps.changeStepState(activeStepNumber + 1, 'active');
				update((n) => n + 1);
			}
		}
	}

	function decrement() {
		const activeStepNumber = get(activeStep);

		if (activeStepNumber > 0) {
			steps.changeStepState(activeStepNumber - 1, 'active');
			steps.changeStepState(activeStepNumber, 'inactive');
			update((n) => n - 1);
		}
	}

	function reset() {
		set(0);
		steps.resetStates();
	}

	return {
		subscribe,
		increment,
		decrement,
		reset
	};
}

export const activeStep = createGeneratorActiveStep();
