<script type="ts">
	import { fade } from 'svelte/transition';
	import type { createActiveStep } from '$stores/custom/steps/ActiveStep';
	import type { Step } from '$stores/custom/steps/step.interface';
	import { Button } from '@emerald-dao/component-library';
	import Icon from '@iconify/svelte';

	export let activeStepStore: ReturnType<typeof createActiveStep>;
	export let step: Step;

	$: buttonState = {
		loading: 'loading' as const,
		active:
			step.isValid === undefined || step.isValid === true
				? ('active' as const)
				: ('disabled' as const),
		success: 'done' as const,
		error: 'active' as const,
		inactive: 'disabled' as const
	};
</script>

{#if step.button}
	<div class="row-space-between" in:fade={{ duration: 300 }} class:gap={$activeStepStore > 0}>
		<div class="row align-center">
			{#if $activeStepStore > 0}
				<Button
					size="small"
					color="neutral"
					type="transparent"
					on:click={activeStepStore.decrement}
				>
					<Icon icon="tabler:arrow-left" />
					Back
				</Button>
			{/if}
		</div>
		<Button
			size="large"
			width="extended"
			state={buttonState[step.state]}
			on:click={activeStepStore.increment}
		>
			{step.button.text}
			{#if step.button.icon && step.state !== 'loading'}
				<Icon icon={step.button.icon} />
			{/if}
		</Button>
	</div>
{/if}

<style lang="scss">
	.gap {
		gap: var(--space-7);
	}
</style>
