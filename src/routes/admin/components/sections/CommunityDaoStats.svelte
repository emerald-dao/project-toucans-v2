<script type="ts">
	import DataCard from '$components/cards/DataCard.svelte';
	import type { CommunityDao } from '$lib/types/dao-project.interface';
	import { Button, ProgressBar } from '@emerald-dao/component-library';

	export let daoData: CommunityDao;
</script>

<div class="main-wrapper">
	<DataCard title="Token" data={daoData.token} hasBackground={true} />
	<DataCard
		title="Circulating Supply"
		data={daoData.circulatingSupply.toLocaleString()}
		icon="tabler:home"
	/>
	<DataCard title="Max Supply" data={daoData.maxSupply.toLocaleString()} icon="tabler:home" />
	<div class="chart-wrapper card">Chart goes here</div>
	<DataCard
		title="Summary"
		hasBackground={true}
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
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		grid-template-rows: repeat(2, auto);
		grid-column-gap: var(--space-5);
		grid-row-gap: var(--space-8);

		.chart-wrapper {
			grid-area: 2 / 1 / 3 / 3;
		}
	}
</style>
