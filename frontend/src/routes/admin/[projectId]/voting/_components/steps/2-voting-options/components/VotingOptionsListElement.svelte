<script lang="ts">
	import { fly } from 'svelte/transition';
	import Icon from '@iconify/svelte';
	import OptionDescription from './atoms/OptionDescription.svelte';
	import OptionNumber from './atoms/OptionNumber.svelte';
	import { createEventDispatcher } from 'svelte';
	import type { VotingOption } from '$lib/features/voting-rounds/types/voting-option.interface';
	import type { SuiteResult } from 'vest';

	export let votingOption: VotingOption;
	export let optionNumber: number;
	export let validationRes: SuiteResult;

	$: nameValidation = validationRes.tests[`option-name-${votingOption.id}`] ?? undefined;

	const dispatch = createEventDispatcher();

	const handleOutOfFocus = () => {
		if (votingOption.name === '') {
			votingOption.name = `Option ${optionNumber}`;
		}

		dispatch('input');
	};
</script>

<div
	class="main-wrapper column-1"
	in:fly|locale={{ duration: 250, y: 5 }}
	class:invalid={nameValidation !== undefined && !nameValidation.valid}
>
	<div class="input-wrapper">
		<OptionNumber number={optionNumber} />
		<input
			type="text"
			name={`option-name-${votingOption.id}`}
			id={`option-name-${votingOption.id}`}
			class="w-medium"
			autocomplete="false"
			autofocus={votingOption.name.length === 0}
			on:blur={handleOutOfFocus}
			on:input
			bind:value={votingOption.name}
		/>
	</div>
	{#if nameValidation !== undefined && nameValidation.valid === false}
		<p class="error-message" in:fly={{ duration: 200, y: 20 }}>{nameValidation.errors[0]}</p>
	{/if}
	<OptionDescription
		bind:description={votingOption.description}
		optionId={votingOption.id}
		on:input
	/>
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

		&.invalid {
			border-color: var(--clr-alert-main);
		}

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

		.error-message {
			color: var(--clr-alert-main);
			font-size: var(--font-size-0);
			padding-left: var(--space-2);
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
