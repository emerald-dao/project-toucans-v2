<script type="ts">
	import DataCard from '$components/atoms/cards/DataCard.svelte';
	import PieChart from '$components/charts/PieChart.svelte';
	import type { CommunityDao } from '$lib/types/dao-project/dao-project.interface';
	import { stringToNumber } from '$lib/utilities/stringToNumber';
	import { Button, ProgressBar } from '@emerald-dao/component-library';

	export let daoData: CommunityDao;

	const mainHolderNames: string[] = Object.keys(daoData.balances);
	const mainHolderAmounts: number[] = Object.values(daoData.balances).map(stringToNumber);
</script>

<div class="main-wrapper">
	<DataCard title="Token" data={daoData.token_symbol} hasBackground={true} />
	<div class="data-card-display">
		<DataCard
			title="Circulating Supply"
			data={Number(daoData.totalSupply).toLocaleString()}
			icon="tabler:home"
		/>
		<!-- <DataCard title="Max Supply" data={daoData.maxSupply.toLocaleString()} icon="tabler:home" /> -->
		<div class="chart-wrapper card">
			<PieChart title="Token distribution" chartData={mainHolderAmounts} labels={mainHolderNames} />
		</div>
	</div>
	<!-- <DataCard
		title="Summary"
		hasBackground={true}
		paddingBlock="var(--space-8)"
		data={`${(daoData.totalSupply / daoData.maxSupply) * 100}%`}
	>
		<ProgressBar
			value={daoData.circulatingSupply}
			max={daoData.maxSupply}
			labelText="Distribution"
		/>
		<Button width="full-width">Distribute Tokens</Button>
	</DataCard> -->
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
			grid-row-gap: var(--space-6);
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
