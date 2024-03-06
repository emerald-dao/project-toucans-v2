<script type="ts">
	import { fly } from 'svelte/transition';
	import Icon from '@iconify/svelte';

	export let description: string;
	export let optionId: string;

	let viewDescription = false;
	let specialMessageInput: HTMLInputElement;

	const onToggleDescription = () => {
		viewDescription = !viewDescription;

		if (viewDescription) {
			setTimeout(() => {
				specialMessageInput.focus();
			}, 200);
		}
	};

	const inputFocusOut = () => {
		if (description === '') {
			viewDescription = false;
		}
	};
</script>

<div class="main-wrapper row-1 align-center">
	{#if !viewDescription}
		<button on:click|preventDefault={onToggleDescription} class="row-2">
			<Icon icon="tabler:plus" />
			Add a description
		</button>
	{/if}
	{#if viewDescription}
		<div class="description-wrapper" in:fly|local={{ x: 20, duration: 200 }}>
			<input
				name={`option-description-${optionId}`}
				id={`option-namdescriptione-${optionId}`}
				placeholder="Write a description for this option"
				maxLength="70"
				bind:value={description}
				bind:this={specialMessageInput}
				on:focusout={inputFocusOut}
				on:input
			/>
		</div>
	{/if}
</div>

<style lang="scss">
	.main-wrapper {
		min-height: 30px;
		padding: var(--space-1) var(--space-2);

		button {
			background: none;
			border: none;
			font-size: var(--font-size-0);
			gap: var(--space-1);
			display: flex;
			flex-direction: row;
			align-items: center;
			cursor: pointer;
			color: var(--clr-text-off);
			transition: color 0.2s ease-in-out;

			&:hover {
				color: var(--clr-text-main);
			}
		}

		.description-wrapper {
			width: 100%;

			input[name='option-description'] {
				border: none;
				width: 100%;
				font-size: var(--font-size-0);
				padding: 0;
				border-radius: 0;
			}
		}
	}
</style>
