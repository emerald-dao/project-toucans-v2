<script type="ts">
	import { Modal } from '@emerald-dao/component-library';
	import StepsOverview from '$components/atoms/StepsOverview.svelte';
	import type { Step } from '$stores/custom/steps/step.interface';
	import StepButtons from './StepButtons.svelte';
	import type { createActiveStep } from '$stores/custom/steps/ActiveStep';

	export let steps: Step[];
	export let heading: string;
	export let icon: string;
	export let description: string | undefined = undefined;
	export let id: string;
	export let activeStepStore: ReturnType<typeof createActiveStep>;
</script>

<Modal background="none" unstyled={true} {id}>
	<div class="round-modal-wrapper" class:grid={steps.length > 2}>
		<StepsOverview {steps} {heading} {icon} {description} hideLastStep={true} />
		<div class="main-wrapper column-space-between">
			<slot />
			{#each steps as step, i}
				{#if $activeStepStore === i}
					<StepButtons {step} {activeStepStore} />
				{/if}
			{/each}
		</div>
	</div>
</Modal>

<style type="scss">
	.round-modal-wrapper {
		display: grid;
		grid-template-columns: 2fr 5fr;
		width: 900px;
		min-height: 540px;
		border: 1px solid var(--clr-neutral-badge);
		border-radius: var(--radius-5);
		overflow: hidden;
		background-color: var(--clr-background-secondary);

		.main-wrapper {
			padding: var(--space-11);
			width: 100%;
		}
	}
</style>
