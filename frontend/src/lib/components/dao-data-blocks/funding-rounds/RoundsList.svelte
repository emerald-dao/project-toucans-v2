<script lang="ts">
	import { RoundsListElement } from '$components/dao-data-blocks';
	import type { DAOProject } from '$lib/types/dao-project/dao-project.interface';

	export let daoData: DAOProject;
</script>

<div class="rounds-wrapper">
	{#each daoData.onChainData.fundingCycles as round, i}
		<RoundsListElement {round} {i} projectToken={daoData.generalInfo.token_symbol} />
	{/each}
</div>

<style lang="scss">
	.rounds-wrapper {
		display: flex;
		flex-direction: column;
	}
</style>
