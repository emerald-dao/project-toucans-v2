<script type="ts">
	import { newRoundSteps, newRoundActiveStep } from '$lib/stores/rounds/RoundSteps';
	import Icon from '@iconify/svelte';
	import type { FinancialDao } from '$lib/types/dao-project.interface';
	import { Button } from '@emerald-dao/component-library';
	import { getContext } from 'svelte';
	import RoundDetail from './components/atoms/RoundDetail.svelte';
	import { Modal, getModal } from '@emerald-dao/component-library';

	const daoData: FinancialDao = getContext('dao-data');
</script>

<div class="card column-3">
	<div class="rounds-wrapper">
		<h5>Active</h5>
		{#each daoData.rounds as round}
			{#if round.status === 'active'}
				<RoundDetail {round} />
			{/if}
		{/each}
	</div>

	<div class="rounds-wrapper">
		<h5>Finished</h5>
		{#each daoData.rounds as round}
			{#if round.status != 'active'}
				<RoundDetail {round} />
			{/if}
		{/each}
	</div>

	<div class="create-round-wrapper">
		<Button on:click={() => getModal().open()} width="extended"
			><Icon icon="tabler:plus" />Create Round</Button
		>
	</div>
</div>
<Modal>
	<div class="column-4 align-end">
		<svelte:component this={$newRoundSteps[$newRoundActiveStep].component} />
	</div>
</Modal>

<style type="scss">
	.card {
		padding: var(--space-12);

		h5 {
			margin-bottom: var(--space-2);
			margin-top: 0;
		}
		.rounds-wrapper {
			display: flex;
			flex-direction: column;
			gap: 1.2rem;
		}
		.rounds-wrapper:not(:last-child) {
			margin-bottom: 2rem;
		}

		.create-round-wrapper {
			display: flex;
			justify-content: flex-end;
			width: 100%;
		}
	}
</style>
