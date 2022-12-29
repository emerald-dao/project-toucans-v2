<script type="ts">
	import ChartTitle from './../atoms/ChartTitle.svelte';
	import DataCard from '$lib/components/cards/DataCard.svelte';
	import type { FinancialDao } from '$lib/types/dao-project.interface';
	import MainFunders from '../atoms/MainFunders.svelte';
	import RecentActivity from '../atoms/RecentActivity.svelte';
	import { daysOfDifference } from '$lib/utilities/formatDate';
	import { Tabs, Tab, TabList, TabPanel } from '@emerald-dao/component-library';

	export let daoData: FinancialDao;
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
				amountRaised={daoData.rounds[0].raised.toLocaleString()}
				currency={daoData.rounds[0].currency}
				goal={daoData.rounds[0].goal}
				daysLeft={daysOfDifference(new Date(), daoData.rounds[0].finishDate)}
				icon="tabler:activity-heartbeat"
			/>
		</div>
	</div>

	<Tabs>
		<TabList>
			<Tab>Recent Activity</Tab>
			<Tab>Main Funders</Tab>
		</TabList>
		<TabPanel>
			<RecentActivity />
		</TabPanel>
		<TabPanel>
			<MainFunders />
		</TabPanel>
	</Tabs>
</div>

<style type="scss">
</style>
