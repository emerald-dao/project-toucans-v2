<script lang="ts">
	import { Tab, TabList, TabPanel, Tabs } from '@emerald-dao/component-library';
	import type { DaoRankingData } from '$lib/features/dao-ranking/types/dao-ranking-data.interface';
	import TokenRankingTable from '$lib/features/dao-ranking/components/TokenRankingTable.svelte';
	import DaoRankingTable from '$lib/features/dao-ranking/components/DaoRankingTable.svelte';

	export let daoRankings: DaoRankingData[];
	export let tokenRankings: DaoRankingData[];
</script>

<section>
	<div class="container-small column-6">
		<h3 class="w-medium">🔥 Hottest DAOs and Tokens</h3>
		<Tabs>
			<TabList>
				<Tab>DAOs</Tab>
				<Tab>Tokens</Tab>
			</TabList>
			<TabPanel>
				<DaoRankingTable projectsData={daoRankings} />
			</TabPanel>
			<TabPanel>
				<TokenRankingTable projectsData={tokenRankings} />
			</TabPanel>
		</Tabs>
	</div>
</section>

<style lang="scss">
	section {
		min-height: 700px;
		background-color: var(--clr-background-secondary);
		display: none;

		@include mq('small') {
			display: block;
		}
	}
</style>
