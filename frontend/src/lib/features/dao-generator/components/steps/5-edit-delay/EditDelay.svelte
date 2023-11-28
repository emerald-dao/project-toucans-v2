<script type="ts">
	import { fly } from 'svelte/transition';
	import Icon from '@iconify/svelte';
	import StepButtons from '../../atoms/StepButtons.svelte';
	import { editDelayOptions } from './editDelayOptions';
	import GLOSSARY from '$lib/config/glossary';
	import type { daoAndTokenGeneratorData } from '$lib/features/dao-generator/stores/DaoAndTokenGeneratorData';
	import { getContext } from 'svelte';
	import { Label } from '@emerald-dao/component-library';

	const daoGeneratorData: typeof daoAndTokenGeneratorData = getContext('daoGeneratorData');
</script>

<form in:fly={{ y: 30, duration: 400 }} class="column-5">
	<h2 class="h4">Edit Delay</h2>
	<p class="small">
		{GLOSSARY.editDelay}
	</p>
	{#each editDelayOptions as option}
		<input
			type="radio"
			id={option.id}
			name="edit-delay"
			bind:group={$daoGeneratorData.tokenomics.editDelay}
			value={option.value}
		/>
		<label for={option.id} class="header-wrapper">
			<div
				class="icon-wrapper"
				class:active={$daoGeneratorData.tokenomics.editDelay === option.value}
			>
				<Icon icon="tabler:clock" />
			</div>
			<h4>{option.title}</h4>
			{#if option.recommended}
				<Label color="tertiary" hasBorder={false} size="x-small">Recommended</Label>
			{/if}
		</label>
	{/each}
	<StepButtons />
</form>

<style type="scss">
	form {
		display: flex;
		flex-direction: column;
		gap: var(--space-2);

		p {
			margin-bottom: var(--space-5);
		}

		input {
			display: none;
		}

		label {
			padding: var(--space-5);
			border: 1px var(--clr-border-primary) solid;
			width: 100%;
			border-radius: var(--radius-3);
			cursor: pointer;
			background-color: var(--clr-surface-primary);
			transition: 0.2s;
			display: flex;
			flex-direction: row;
			align-items: center;
			justify-content: flex-start;
			margin-bottom: var(--space-3);
			gap: 0.7em;

			.icon-wrapper {
				display: grid;
				place-content: center;
				padding: 0.3em;
				border-radius: 50%;
				background-color: var(--clr-neutral-badge);
				transition: 0.2s;
			}

			.icon-wrapper.active {
				background-color: var(--clr-primary-badge);
				color: var(--clr-primary-main);
			}

			h4 {
				font-size: var(--font-size-2);
				color: var(--clr-text-main);
				transition: 0.2s;
			}
		}

		input:checked {
			& + label {
				border-color: var(--clr-heading-main);

				h4 {
					color: var(--clr-heading-main);
				}
			}
		}
	}
</style>
