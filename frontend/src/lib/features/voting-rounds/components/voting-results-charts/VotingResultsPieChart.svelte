<script lang="ts">
	import type { VotingRoundStore } from './../../utils/createVotingRoundStore.ts';
	import PieChart from '$lib/components/charts/PieChart.svelte';
	import Icon from '@iconify/svelte';
	import type { VotingOption } from '$lib/utilities/api/supabase/fetchAllVotingRounds.js';

	export let votingRoundStore: VotingRoundStore;
	export let votingRoundName: string;
	export let votingOptions: VotingOption[];
</script>

<div class="chart-wrapper">
	{#await $votingRoundStore.allVotes}
		<div class="loading-wrapper">
			<Icon icon="svg-spinners:180-ring-with-bg" width="2rem" />
		</div>
	{:then allVotes}
		{#if $votingRoundStore.votingStatus === 'upcoming'}
			<em class="text-small">Chart will be available once the round starts</em>
		{:else if allVotes.length === 0}
			<em class="text-small">No votes yet</em>
		{:else}
			{#await $votingRoundStore.votesResults then results}
				{@const options = Object.keys(results)}
				{@const totalVotes = Object.values(results)}
				{@const optionsNames = options.map(
					(option) =>
						votingOptions.find((votingOption) => Number(votingOption.id) === Number(option))?.name
				)}
				<PieChart title={votingRoundName} chartData={totalVotes} labels={optionsNames} />
			{/await}
		{/if}
	{/await}
</div>

<style lang="scss">
	.chart-wrapper {
		display: flex;
		justify-content: center;
		align-items: center;
		text-align: center;
		height: 100%;

		em {
			color: var(--clr-text-off);
		}
	}

	.loading-wrapper {
		display: flex;
		justify-content: center;
		align-items: center;
		height: 100%;
		width: 100%;
		color: var(--clr-text-off);
	}
</style>
