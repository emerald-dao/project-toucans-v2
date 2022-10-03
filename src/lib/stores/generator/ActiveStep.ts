import { get, writable } from 'svelte/store';
import { steps } from './Steps';

function createGeneratorActiveStep() {
	const { subscribe, set, update } = writable(0);

	function increment() {
		if (get(steps).length - 1 > get(activeStep)) {
			update((n) => n + 1);
			steps.changeStepState(get(activeStep) - 1, 'success');
			steps.changeStepState(get(activeStep), 'active');
		}
	}

	function decrement() {
		if (get(activeStep) > 0) {
			update((n) => n - 1);
			steps.changeStepState(get(activeStep), 'active');
			steps.changeStepState(get(activeStep) + 1, 'inactive');
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
