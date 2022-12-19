<script type="ts">
	import type { FinancialDao } from '$lib/types/dao-project.interface';
	import { getContext } from 'svelte';
	import RoundDetail from './components/round/RoundDetail.svelte';

	const daoData: FinancialDao = getContext('dao-data');
</script>

<div class="card column-10">
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
</div>

<style type="scss">
	.card {
		padding: var(--space-12);
		h5 {
			margin-bottom: 0.8rem;
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
	}
</style>
