<script type="ts">
	import { Button } from '@emerald-dao/component-library';
	import type { DaoRankingData } from '../types/dao-ranking-data.interface';
	import DaoRankingRow from './atoms/DaoRankingRow.svelte';
	import Icon from '@iconify/svelte';

	export let projectsData: DaoRankingData[];

	export let pageSize = 10;
	let currentPage = 1;
	const nextPage = () => {
		currentPage += 1;
	};
	const prevPage = () => {
		currentPage -= 1;
	};
	$: pageStart = (currentPage - 1) * pageSize;
	$: pageEnd = pageStart + pageSize;
	$: currentPageDaos = projectsData.slice(pageStart, pageEnd);
</script>

<div class="table-wrap">
	<table class="table table-bordered table-dark table-hover">
		<thead>
			<tr>
				<th class="left-align">#</th>
				<th class="left-align">Name</th>
				<th>Treasury Value</th>
				<th>Total Funding</th>
				<th>NFTs</th>
				<th>Proposals</th>
				<th>Participants</th>
				<th>Funding</th>
			</tr>
		</thead>
		<tbody>
			{#each currentPageDaos as project, i (project.project_id)}
				<DaoRankingRow {project} number={i + (currentPage - 1) * pageSize} />
			{/each}
		</tbody>
	</table>
	<div class="pagination row-space-between">
		<div class="row-4">
			<Button
				on:click={prevPage}
				state={currentPage === 1 ? 'disabled' : 'active'}
				type="transparent"
				color="neutral"
			>
				<Icon icon="tabler:arrow-left" />
			</Button>
			<Button
				on:click={nextPage}
				state={pageEnd >= projectsData.length ? 'disabled' : 'active'}
				type="transparent"
				color="neutral"
			>
				<Icon icon="tabler:arrow-right" />
			</Button>
		</div>
	</div>
</div>

<style type="scss">
	.table {
		width: 100%;
		border-spacing: 0 var(--space-5);

		th {
			color: var(--clr-text-main);
			font-size: var(--font-size-0);
			text-align: right;
		}

		.left-align {
			text-align: left;
		}
	}
</style>
