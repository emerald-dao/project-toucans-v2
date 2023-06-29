<script lang="ts">
	import LineChart from '$components/charts/LineChart.svelte';
	import type { DAOProject } from '$lib/types/dao-project/dao-project.interface';

	export let daoData: DAOProject;
</script>

{#if daoData.recentFunding.length > 0}
	<LineChart
		title={`${daoData.generalInfo.name}-chart`}
		chartData={daoData.recentFunding}
		labels={Array(daoData.recentFunding.length).fill('')}
	/>
{:else}
	<div class="no-funding-wrapper center">
		<span class="xsmall">
			<em> No funding received in the last 7 days </em>
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
