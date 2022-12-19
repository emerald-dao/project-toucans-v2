<script type="ts">
	import ChartTitle from './../atoms/ChartTitle.svelte';
	import DataCard from '$lib/components/cards/DataCard.svelte';
	import Tabs from '$components/atoms/Tabs.svelte';
	import type { FinancialDao } from '$lib/types/dao-project.interface';
	import MainFounders from '../atoms/MainFounders.svelte';
	import RecentActivity from '../atoms/RecentActivity.svelte';

	export let daoData: FinancialDao;

	let tabs = [
		{
			name: 'Recent Activity',
			component: RecentActivity
		},
		{
			name: 'Main Founders',
			component: MainFounders
		}
	];
</script>

<div class="column-10">
	<div class="main-wrapper column-8">
		<div class="row-4">
			<DataCard
				title="Total Funding"
				icon="tabler:pig-money"
				data={daoData.totalFusdRaised.toLocaleString()}
			/>
			<DataCard title="Total Tokens" icon="tabler:coin" data={daoData.maxSupply.toLocaleString()} />
			<DataCard title="Rounds" icon="tabler:rotate-dot" data={daoData.rounds.length} />
		</div>
		<div class="card">
			<ChartTitle
				title="Active Round"
				data={`${daoData.rounds[0].raised.toLocaleString()} ${daoData.rounds[0].currency} raised`}
				icon="tabler:activity-heartbeat"
			/>
		</div>
	</div>
	<Tabs {tabs} />
</div>

<style type="scss">
</style>
