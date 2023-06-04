<script lang="ts">
	import type { Step } from '$stores/custom/steps/step.interface';
	import { ProgressSteps } from '@emerald-dao/component-library';
	import IconCircle from './IconCircle.svelte';

	export let steps: Step[];
	export let hideLastStep = false;
	export let heading: string;
	export let icon: string | undefined = undefined;
	export let description: string | undefined = undefined;

	$: if (hideLastStep) {
		steps = steps.slice(0, -1);
	}
</script>

<div class="main-wrapper">
	{#if heading}
		<div class="heading-wrapper row-3 align-center">
			{#if icon}
				<IconCircle color="primary" {icon} />
			{/if}
			<h2>{heading}</h2>
		</div>
	{/if}
	{#if description}
		<p class="small">{description}</p>
	{/if}
	{#if steps.length > 1}
		<ProgressSteps {steps} direction="column-reverse" diameter={0.9} gap={1.4} fontSize="medium" />
	{/if}
</div>

<style lang="scss">
	.main-wrapper {
		background-color: var(--clr-background-primary);
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		padding: var(--space-8) var(--space-10);
		width: 100%;

		.heading-wrapper {
			margin-bottom: var(--space-3);

			h2 {
				font-size: var(--font-size-4);
			}
		}
	}
</style>
