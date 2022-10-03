import type { Writable } from 'svelte/store';
import type { Step } from './generator-step.interface';
import type { StepState } from './generator-step-state.type';

export interface StepsStore extends Pick<Writable<Step[]>, 'subscribe'> {
	changeStepState: (index: number, state: StepState) => void;
	resetStates: () => void;
}
