<script lang="ts">
	import { Currency } from '@emerald-dao/component-library';
	import LeaderboardListElement from '../../../leaderboards/atoms/LeaderboardListElement.svelte';
	import type { DAOProject } from '$lib/types/dao-project/dao-project.interface';
	import ListWrapper from '$components/atoms/lists/ListWrapper.svelte';

	export let daoData: DAOProject;

	let paginationMax: number;
	let paginationMin: number;

	let pageMove: 'next' | 'previous' = 'next';

	const lpAddresses = Object.values(daoData.onChainData.lpAddresses);
	const holdersEntries = Object.entries(daoData.onChainData.balances);
	const mainHoldersEntries = holdersEntries
		.filter((entry) => entry[0] !== daoData.generalInfo.owner && !lpAddresses.includes(entry[0]))
		.sort((a, b) => (Number(a[1]) < Number(b[1]) ? 1 : Number(a[1]) > Number(b[1]) ? -1 : 0));
</script>

<div>
	<ListWrapper
		itemsPerPage={6}
		totalItems={mainHoldersEntries.length}
		noItemsMessage="This DAO has no holders yet"
		bind:paginationMax
		bind:paginationMin
		on:nextPage={() => (pageMove = 'next')}
		on:previousPage={() => (pageMove = 'previous')}
	>
		{#each mainHoldersEntries as [address, holdings], i}
			{#if i < paginationMax && i >= paginationMin}
				<LeaderboardListElement
					rank={i + 1}
					{address}
					bind:pageMove
					pagePosition={i - paginationMin}
				>
					<Currency
						amount={holdings}
						currency={daoData.generalInfo.token_symbol}
						decimalNumbers={2}
						color="heading"
					/>
				</LeaderboardListElement>
			{/if}
		{/each}
	</ListWrapper>
</div>
