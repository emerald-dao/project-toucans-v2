<script type="ts">
	import { getFundingCycleData } from '$lib/utilities/projects/getFundingCycleData';
	import type { DAOProject } from '$lib/types/dao-project/dao-project.interface';
	import TokenStats from './discover-project-blocks/TokenStats.svelte';
	import ProjectCharts from './discover-project-blocks/ProjectCharts.svelte';
	import ProjectLists from './discover-project-blocks/ProjectLists.svelte';
	import { RoundsCard } from '$components/dao-data-blocks';

	export let daoData: DAOProject;

	const currentFundingCycleData = daoData.onChainData.currentFundingCycle
		? getFundingCycleData(daoData, Number(daoData.onChainData.currentFundingCycle))
		: null;
</script>

{#if daoData}
	<div class="column-6">
		<TokenStats {daoData} />
		{#if currentFundingCycleData}
			<RoundsCard round={currentFundingCycleData} projectToken={daoData.generalInfo.token_symbol} />
		{/if}
		<ProjectCharts {daoData} />
		<ProjectLists {daoData} />
	</div>
{/if}
