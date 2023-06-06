<script lang="ts">
	import { Tab, TabList, TabPanel, Tabs } from '@emerald-dao/component-library';
	import DaoRanking from '$lib/features/dao-ranking/components/DaoRanking.svelte';
	import TokenRanking from '$lib/features/dao-ranking/components/TokenRanking.svelte';
	import type { DaoRankingData } from '$lib/features/dao-ranking/types/dao-ranking-data.interface';

	export let daoRankings: DaoRankingData[];
	export let tokenRankings: DaoRankingData[];
</script>

<section>
	<div class="container-small column-6">
		<h3 class="w-medium">🔥 Hotest Communities and Tokens</h3>
		<Tabs>
			<TabList>
				<Tab>Communities</Tab>
				<Tab>Tokens</Tab>
			</TabList>
			<TabPanel>
				<DaoRanking {daoRankings} />
			</TabPanel>
			<TabPanel>
				<TokenRanking {tokenRankings} />
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
