<script type="ts">
	import BarChart from '$components/charts/BarChart.svelte';
	import PieChart from '$components/charts/PieChart.svelte';
	import { getAccountFromDiscordBatch, getFindNamesBatch } from '$flow/utils';
	import type { FindMap } from '$lib/types/common/find.interface';
	import type { DAOProject } from '$lib/types/dao-project/dao-project.interface';

	export let daoData: DAOProject;
	let voterLeaderboard: { [key: string]: number } = {};
	for (const proposal of daoData.votes) {
		for (const voter of proposal.votes) {
			voterLeaderboard[voter.voter] = (voterLeaderboard[voter.voter] || 0) + 1;
		}
	}
	const mainVoters = Object.entries(voterLeaderboard)
		.sort((a, b) => Number(b[1]) - Number(a[1]))
		.slice(0, 6);
	const mainVotersAccounts = mainVoters.map((holder) => holder[0]);
	const mainVotersAmounts = mainVoters.map((holder) => Number(holder[1]));

	async function getAccountInfo() {
		const accounts: FindMap = await getAccountFromDiscordBatch(mainVotersAccounts);
		return mainVotersAccounts.map((voter) => accounts[voter]);
	}
</script>

<div class="panel-container">
	{#if mainVotersAmounts.length < 1}
		<span><em>This DAO has no voters yet</em></span>
	{:else}
		<div class="chart-wrapper">
			{#await getAccountInfo()}
				<PieChart title="Voters" chartData={mainVotersAmounts} labels={mainVotersAccounts} />
			{:then accountInfo}
				<PieChart title="Token distribution" chartData={mainVotersAmounts} labels={accountInfo} />
			{/await}
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
