<script lang="ts">
	import LineChart from '$components/charts/LineChart.svelte';
	import type { DAOProject } from '$lib/types/dao-project/dao-project.interface';

	export let daoData: DAOProject;
</script>

{#if daoData.funding.numbers && daoData.funding.numbers.length > 1}
	<LineChart
		title={`${daoData.generalInfo.name}-chart`}
		chartData={daoData.funding.numbers}
		labels={Array(daoData.funding.numbers.length).fill('')}
	/>
{:else}
	<div class="no-funding-wrapper center">
		<span class="xsmall">
			<em> No funding received </em>
		</span>
	</div>
{/if}

<style lang="scss">
	.no-funding-wrapper {
		margin-top: var(--space-3);
		flex: 1;

		em {
			color: var(--clr-text-off);
		}
	}
</style>
