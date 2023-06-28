<script type="ts">
	import { getFundingCycleData } from '$lib/utilities/projects/getFundingCycleData';
	import type { DAOProject } from '$lib/types/dao-project/dao-project.interface';
	import TokenStats from './widgets/TokenStats.svelte';
	import ProjectCharts from './widgets/PrimaryTabsWidget/PrimaryTabsWidget.svelte';
	import ProjectLists from './widgets/SecondaryTabsWidget/SecondaryTabsWidget.svelte';
	import { user } from '$stores/flow/FlowStore';
	import RoundsWidget from '$lib/components/dao-data-blocks/funding-rounds/widget/RoundsWidget.svelte';

	export let daoData: DAOProject;

	$: currentFundingCycleData =
		daoData.hasToken && daoData.onChainData.currentFundingCycle && daoData.events
			? getFundingCycleData(
					daoData.onChainData.fundingCycles,
					daoData.events,
					daoData.onChainData.currentFundingCycle.details.cycleId
			  )
			: null;
</script>

{#if daoData}
	<div class="column-6">
		<TokenStats {daoData} />
		{#if currentFundingCycleData}
			<RoundsWidget
				round={currentFundingCycleData}
				projectId={daoData.generalInfo.project_id}
				projectToken={daoData.generalInfo.token_symbol}
				paymentToken={daoData.onChainData.paymentCurrency}
				claimOverflow={daoData.userBalance != undefined &&
					daoData.userBalance > 0 &&
					$user.addr != undefined}
				activeRound={daoData.onChainData.currentFundingCycle
					? Number(daoData.onChainData.currentFundingCycle.details.cycleId)
					: null}
			/>
		{/if}
		<ProjectCharts {daoData} />
		<ProjectLists {daoData} />
	</div>
{/if}
