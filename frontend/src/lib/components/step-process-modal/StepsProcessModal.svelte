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
		<div class="overview-wrapper">
			<StepsOverview {steps} {heading} {icon} {description} hideLastStep={true} />
		</div>
		<div class="main-wrapper column-space-between">
			<div class="column-6">
				{#if steps[$activeStepStore].name || steps[$activeStepStore].description}
					<div class="title-wrapper column-1">
						{#if steps[$activeStepStore].name}
							<h4>{steps[$activeStepStore].name}</h4>
						{/if}
						{#if steps[$activeStepStore].description}
							<p class="xsmall">{steps[$activeStepStore].description}</p>
						{/if}
					</div>
				{/if}
				<slot />
			</div>
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
		border: 1px solid var(--clr-neutral-badge);
		border-radius: var(--radius-5);
		background-color: var(--clr-background-secondary);
		max-width: 900px;
		overflow: hidden;

		@include mq('medium') {
			min-height: 500px;
			display: grid;
			grid-template-columns: 2fr 5fr;
		}

		.overview-wrapper {
			display: none;

			@include mq('medium') {
				display: flex;
			}
		}

		.main-wrapper {
			padding: var(--space-9);
			gap: var(--space-7);

			.title-wrapper {
				border-bottom: 1px var(--clr-neutral-badge) solid;
				padding-bottom: var(--space-3);

				h4 {
					font-size: var(--font-size-3);
				}
			}
		}
	}
</style>
