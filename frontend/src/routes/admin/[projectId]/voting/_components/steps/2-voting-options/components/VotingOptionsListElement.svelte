<script lang="ts">
	import { fade, fly } from 'svelte/transition';
	import Icon from '@iconify/svelte';
	import type { VotingOption } from '../voting-option.interface';
	import OptionDescription from './atoms/OptionDescription.svelte';
	import OptionNumber from './atoms/OptionNumber.svelte';
	import { createEventDispatcher } from 'svelte';

	export let votingOption: VotingOption;
	export let optionNumber: number;

	const dispatch = createEventDispatcher();

	const handleOutOfFocus = () => {
		if (votingOption.name === '') {
			votingOption.name = `Option ${optionNumber}`;
		}
	};
</script>

<div class="main-wrapper column-1" in:fly|locale={{ duration: 250, y: 5 }}>
	<div class="input-wrapper">
		<OptionNumber number={optionNumber} />
		<input
			type="text"
			name="option-name"
			class="w-medium"
			autocomplete="false"
			autofocus={votingOption.name.length === 0}
			on:blur={handleOutOfFocus}
			bind:value={votingOption.name}
		/>
	</div>
	<OptionDescription bind:description={votingOption.description} />
	{#if optionNumber > 2}
		<button class="header-link" on:click={() => dispatch('delete', { id: votingOption.id })}>
			<Icon icon="tabler:x" color="inherit" width="13px" />
		</button>
	{/if}
</div>

<style lang="scss">
	.main-wrapper {
		border: 1px solid var(--clr-border-primary);
		padding: var(--space-3);
		border-radius: var(--radius-2);
		background-color: var(--clr-surface-primary);
		position: relative;

		.input-wrapper {
			display: flex;
			flex-direction: row;
			gap: var(--space-0);
			border-bottom: 1px solid var(--clr-neutral-badge);
			padding: 0 var(--space-2) var(--space-2) var(--space-2);
			align-items: center;

			input {
				border: none;
				font-size: var(--font-size-1);
				color: var(--clr-heading-main);
				border-radius: 0;
			}
		}

		button {
			position: absolute;
			top: var(--space-2);
			right: var(--space-2);
			background-color: transparent;
			border: none;
			cursor: pointer;
			font-size: var(--font-size-2);
		}
	}
</style>
