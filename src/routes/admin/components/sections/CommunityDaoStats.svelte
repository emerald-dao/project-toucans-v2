<script type="ts">
	import DataCard from '$components/cards/DataCard.svelte';
	import PieChart from '$components/charts/PieChart.svelte';
	import type { CommunityDao } from '$lib/types/dao-project.interface';
	import { Button, ProgressBar } from '@emerald-dao/component-library';

	export let daoData: CommunityDao;

	const mainHolderNames: string[] = daoData.mainHolders.map((x) => x[0]);
	const mainHolderAmounts: number[] = daoData.mainHolders.map((x) => x[1]);
</script>

<div class="main-wrapper">
	<DataCard title="Token" data={daoData.token} hasBackground={true} />
	<div class="data-card-display">
		<DataCard
			title="Circulating Supply"
			data={daoData.circulatingSupply.toLocaleString()}
			icon="tabler:home"
		/>
		<DataCard title="Max Supply" data={daoData.maxSupply.toLocaleString()} icon="tabler:home" />
		<div class="chart-wrapper card">
			<PieChart title="Token distribution" chartData={mainHolderAmounts} labels={mainHolderNames} />
		</div>
	</div>
	<DataCard
		title="Summary"
		hasBackground={true}
		paddingBlock="var(--space-8)"
		data={`${(daoData.circulatingSupply / daoData.maxSupply) * 100}%`}
	>
		<ProgressBar
			value={daoData.circulatingSupply}
			max={daoData.maxSupply}
			labelText="Distribution"
		/>
		<Button width="full-width">Distribute Tokens</Button>
	</DataCard>
</div>

<style type="scss">
	.main-wrapper {
		display: flex;
		flex-direction: column;
		gap: var(--space-10);

		@include mq('medium') {
			display: grid;
			grid-template-columns: repeat(3, 1fr);
			grid-template-rows: repeat(2, auto);
			grid-column-gap: var(--space-5);
			grid-row-gap: var(--space-8);
		}

		.data-card-display {
			display: none;
			height: fit-content;

			@include mq('medium') {
				display: contents;
			}
		}

		.chart-wrapper {
			grid-area: 2 / 1 / 3 / 3;
			padding-inline: var(--space-13);
		}
	}
</style>
