<script lang="ts">
	import { RoundsListElement } from '$components/dao-data-blocks';
	import type { DAOProject } from '$lib/types/dao-project/dao-project.interface';

	export let daoData: DAOProject;
</script>

<div class="rounds-wrapper">
	{#if daoData.onChainData.fundingCycles.length > 0}
		{#each daoData.onChainData.fundingCycles as round, i}
			<RoundsListElement {round} {i} projectToken={daoData.generalInfo.token_symbol} />
		{/each}
	{:else}
		<div class="no-rounds-wrapper">
			<span class="small"><em>No rounds created</em></span>
		</div>
	{/if}
</div>

<style lang="scss">
	.rounds-wrapper {
		display: flex;
		flex-direction: column;

		.no-rounds-wrapper {
			display: flex;
			margin-top: var(--space-4);

			em {
				color: var(--clr-text-off);
			}
		}
	}
</style>
