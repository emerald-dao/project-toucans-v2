<script lang="ts">
	import { Currency } from '@emerald-dao/component-library';
	import LeaderboardListElement from '../../../leaderboards/atoms/LeaderboardListElement.svelte';
	import type { DAOProject } from '$lib/types/dao-project/dao-project.interface';

	export let daoData: DAOProject;

	const mainFundersEntries = Object.entries(daoData.onChainData.funders)
		.sort((a, b) => Number(b[1]) - Number(a[1]))
		.slice(0, 6);
</script>

<div>
	{#if daoData.generalInfo.token_symbol}
		{#each mainFundersEntries as [address, funding], i}
			<LeaderboardListElement rank={i + 1} {address}>
				<Currency amount={funding} currency={daoData.onChainData.paymentCurrency} color="heading" />
			</LeaderboardListElement>
		{/each}
	{/if}
</div>
