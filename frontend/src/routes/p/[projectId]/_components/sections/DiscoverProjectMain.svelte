<script type="ts">
	import { getFundingCycleData } from '$lib/utilities/projects/getFundingCycleData';
	import type { DAOProject } from '$lib/types/dao-project/dao-project.interface';
	import ProjectCharts from './widgets/PrimaryTabsWidget.svelte';
	import ProjectLists from './widgets/SecondaryTabsWidget.svelte';
	import { user } from '$stores/flow/FlowStore';
	import RoundsWidget from '$lib/components/dao-data-blocks/funding-rounds/widget/RoundsWidget.svelte';
	import UserBalanceWidget from './widgets/UserBalanceWidget.svelte';
	import ProjectFundingWidget from './widgets/ProjectFundingWidget.svelte';
	import TokenAnalysisWidget from './widgets/TokenAnalysisWidget.svelte';
	import NotableMembersWidget from './widgets/NotableMembersWidget/NotableMembersWidget.svelte';
	import NftsTreasuryWidget from './widgets/NftsTreasuryWidget.svelte';
	import VotingsWidget from './widgets/VotingsWidget.svelte';

	export let daoData: DAOProject;
	export let reloadUserBalance: () => void;

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
	<div class="column-8">
		<div class="main-wrapper">
			{#if daoData.hasToken && $user.addr}
				<UserBalanceWidget {daoData} {reloadUserBalance} />
			{/if}
			<div class="secondary-wrapper">
				<ProjectFundingWidget {daoData} />
				{#if daoData.hasToken}
					<TokenAnalysisWidget {daoData} />
				{/if}
			</div>
		</div>
		<NotableMembersWidget {daoData} />
		<VotingsWidget
			votingRounds={daoData.votingRounds}
			daoSigners={daoData.onChainData.signers}
			tokenContractAddress={daoData.generalInfo.contract_address}
		/>
		{#if daoData.hasToken && currentFundingCycleData && daoData.generalInfo.token_symbol}
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
		{#if daoData.onChainData.allowedNFTCollections.length > 0}
			<NftsTreasuryWidget
				pageSize={3}
				nftUuidOwnerMap={daoData.generalInfo.nftUuidOwnerMap}
				{daoData}
			/>
		{/if}
		<ProjectCharts {daoData} />
		<ProjectLists {daoData} />
	</div>
{/if}

<style lang="scss">
	.main-wrapper {
		display: flex;
		flex-direction: column;
		gap: var(--space-6);

		.secondary-wrapper {
			display: flex;
			gap: var(--space-7);
			flex-direction: column;

			@include mq('medium') {
				flex-direction: row;
			}
		}
	}
</style>
