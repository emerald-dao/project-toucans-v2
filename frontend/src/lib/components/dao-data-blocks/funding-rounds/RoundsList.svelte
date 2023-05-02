<script lang="ts">
	import { RoundsListElement } from '$components/dao-data-blocks';
	import type { DAOProject } from '$lib/types/dao-project/dao-project.interface';

	export let daoData: DAOProject;
	export let finishedFilter = true;

	console.log(daoData);

	let showFinished = false;
</script>

<div class="rounds-wrapper">
	{#if finishedFilter}
		<label for="show-finished" class="switch">
			<input type="checkbox" name="show-finished" id="show-finished" bind:checked={showFinished} />
			<span class="slider" />
			Show finished
		</label>
	{/if}
	{#if daoData.onChainData.fundingCycles.length > 0}
		{#each daoData.onChainData.fundingCycles as round}
			{#if new Date(Number(round.details.timeframe.endTime) * 1000) > new Date() || round.details.timeframe.endTime == null || showFinished}
				<RoundsListElement
					{round}
					activeRound={daoData.onChainData.currentFundingCycle
						? Number(daoData.onChainData.currentFundingCycle.details.cycleId)
						: null}
					roundNumber={Number(round.details.cycleId)}
					projectToken={daoData.generalInfo.token_symbol}
					paymentToken={daoData.onChainData.paymentCurrency}
					projectId={daoData.generalInfo.project_id}
				/>
			{/if}
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

		label {
			margin-bottom: var(--space-6);
		}

		.no-rounds-wrapper {
			display: flex;
			margin-top: var(--space-4);

			em {
				color: var(--clr-text-off);
			}
		}
	}
</style>
