<script type="ts">
	import { fly } from 'svelte/transition';
	import { daoGeneratorData } from '$lib/features/dao-generator/stores/DaoGeneratorData';
	import Icon from '@iconify/svelte';
	import StepButtons from '../../atoms/StepButtons.svelte';
	import { editDelayOptions } from './editDelayOptions';

	$: activeOption = editDelayOptions.find(
		(option) => option.value === $daoGeneratorData.tokenomics.editDelay
	);
</script>

<form in:fly={{ y: 30, duration: 400 }} class="column-5">
	<h2 class="h4">Edit Delay</h2>
	<p class="small">
		{#if $daoGeneratorData.tokenomics.editDelay === '0.00'}
			{`You can edit the configuration of your funding round `}
			<span>
				{`at any time `}
			</span>
			{`before it starts.`}
		{:else}
			{`When launching a funding round, you can edit its configuration at least`}
			<span>
				{activeOption?.title}
			</span>
			{`days before the round starts.`}
		{/if}
		{`This is to prevent any last-minute changes that could affect the outcome of the round. The higher the delay, the greater trust your community will have in you.`}
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

			span {
				color: var(--clr-tertiary-main);
			}
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
				border-color: var(--clr-primary-main);

				h4 {
					color: var(--clr-heading-main);
				}
			}
		}
	}
</style>
