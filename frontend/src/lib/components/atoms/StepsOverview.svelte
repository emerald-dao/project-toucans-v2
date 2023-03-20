<script lang="ts">
	import type { Step } from '$stores/custom/steps/step.interface';
	import { ProgressSteps } from '@emerald-dao/component-library';
	import IconCircle from './IconCircle.svelte';

	export let steps: Step[];
	export let hideLastStep = false;
	export let heading: string;
	export let icon: string | undefined = undefined;

	$: if (hideLastStep) {
		steps = steps.slice(0, -1);
	}
</script>

<div class="main-wrapper">
	{#if heading}
		<div class="row-3">
			{#if icon}
				<IconCircle color="tertiary" {icon} />
			{/if}
			<h2>{heading}</h2>
		</div>
	{/if}
	<ProgressSteps {steps} direction="column-reverse" diameter={0.9} gap={1.4} fontSize="medium" />
</div>

<style lang="scss">
	.main-wrapper {
		background-color: var(--clr-background-primary);
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		padding: var(--space-8) var(--space-10);

		h2 {
			padding-bottom: 2rem;
			font-size: var(--font-size-4);
		}
	}
</style>
