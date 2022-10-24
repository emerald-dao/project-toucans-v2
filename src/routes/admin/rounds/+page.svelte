<script type="ts">
	import type { FullDaoProject } from '$lib/types/dao-project.interface';
	import { getContext } from 'svelte';
	import RoundDetail from './components/round/RoundDetail.svelte';

	const daoData: FullDaoProject = getContext('dao-data');
</script>

<div class="main-wrapper">
	<div class="rounds-wrapper">
		<h4>Active</h4>
		{#each daoData.rounds as round}
			{#if round.status === 'active'}
				<RoundDetail {round} />
			{/if}
		{/each}
	</div>

	<div class="rounds-wrapper">
		<h4>Finished</h4>
		{#each daoData.rounds as round}
			{#if round.status != 'active'}
				<RoundDetail {round} />
			{/if}
		{/each}
	</div>
</div>

<style type="scss">
	.main-wrapper {
		width: 100%;
		display: flex;
		flex-direction: column;
		gap: 3rem;

		h4 {
			font-size: var(--fs-400);
			margin-bottom: 0.8rem;
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
