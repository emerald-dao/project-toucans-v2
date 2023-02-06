import type { ProgressStates } from '@emerald-dao/component-library/components/ProgressStep/progress-states.type';
import type { SvelteComponent } from 'svelte';

export interface Step {
	name: string;
	slug?: string;
	component: typeof SvelteComponent;
	action: null | (() => Promise<void>);
	form: boolean;
	state: ProgressStates;
}
