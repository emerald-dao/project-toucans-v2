<script lang="ts">
	import { Currency } from '@emerald-dao/component-library';
	import LeaderboardListElement from '../../../leaderboards/atoms/LeaderboardListElement.svelte';
	import type { DAOProject } from '$lib/types/dao-project/dao-project.interface';

	export let daoData: DAOProject;

	const lpAddresses = Object.values(daoData.onChainData.lpAddresses);
	const holdersEntries = Object.entries(daoData.onChainData.balances);
	const mainHoldersEntries = holdersEntries
		.filter((entry) => entry[0] !== daoData.generalInfo.owner && !lpAddresses.includes(entry[0]))
		.sort((a, b) => (Number(a[1]) < Number(b[1]) ? 1 : Number(a[1]) > Number(b[1]) ? -1 : 0))
		.slice(0, 6);
</script>

<div>
	{#if daoData.generalInfo.token_symbol}
		{#each mainHoldersEntries as [address, holdings], i}
			<LeaderboardListElement rank={i + 1} {address}>
				<Currency amount={holdings} currency={daoData.generalInfo.token_symbol} color="heading" />
			</LeaderboardListElement>
		{/each}
	{/if}
</div>
