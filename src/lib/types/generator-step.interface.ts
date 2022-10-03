import type { SvelteComponent } from 'svelte';
import type { StepState } from './generator-step-state.type';

export interface Step {
	title: string;
	component: typeof SvelteComponent;
	state: StepState;
}
