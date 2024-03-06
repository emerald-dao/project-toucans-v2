<script lang="ts">
	import { user } from '../../../../stores/flow/FlowStore';
	import type { DAOProject } from '$lib/types/dao-project/dao-project.interface';
	import RoundsListElement from './RoundsListElement.svelte';

	export let daoData: DAOProject;
	export let finishedFilter = true;

	$: admin = $user ? daoData.onChainData.signers.includes($user.addr as string) : false;

	let showFinished = false || !finishedFilter;
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
		{#each daoData.onChainData.fundingCycles as round, i}
			{#if new Date(Number(round.details.timeframe.endTime) * 1000) > new Date() || round.details.timeframe.endTime == null || showFinished}
				<RoundsListElement
					{daoData}
					{round}
					activeRound={daoData.onChainData.currentFundingCycle
						? Number(daoData.onChainData.currentFundingCycle.details.cycleId)
						: null}
					roundNumber={i}
					{admin}
					paused={!daoData.onChainData.purchasing}
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
