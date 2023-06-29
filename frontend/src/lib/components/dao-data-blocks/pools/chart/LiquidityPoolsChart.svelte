<script type="ts">
	import type { DAOProject } from '$lib/types/dao-project/dao-project.interface';
	import PieChart from '$components/charts/PieChart.svelte';

	export let daoData: DAOProject;

	const lpHolders = Object.entries(daoData.onChainData.lpAddresses);
	const lpHoldersAccounts = lpHolders.map(
		(lpHolder) => lpHolder[0] + ' <> ' + daoData.generalInfo.token_symbol
	);
	const lpHoldersAmounts = lpHolders.map((lpHolder) =>
		Number(daoData.onChainData.balances[lpHolder[1]])
	);
</script>

<div class="panel-container">
	{#if lpHoldersAmounts.length < 1}
		<span><em>This token has no liquidity pools yet</em></span>
	{:else}
		<div class="chart-wrapper">
			<PieChart title="Liquidity pools" chartData={lpHoldersAmounts} labels={lpHoldersAccounts} />
		</div>
	{/if}
</div>

<style type="scss">
	.panel-container {
		display: flex;
		justify-content: center;
		min-height: var(--space-20);
		align-items: center;

		em {
			color: var(--clr-text-off);
		}

		.chart-wrapper {
			margin-top: var(--space-6);
			position: relative;
			width: 40vw;
			align-self: center;

			@include mq('medium') {
				width: auto;
				max-width: 400px;
			}
		}
	}
</style>
