<script lang="ts">
	import RankingTable from './atoms/RankingTable.svelte';
	import type { DaoRankingData } from '../types/dao-ranking-data.interface';

	export let projectsData: DaoRankingData[] = [];
</script>

<section class="container">
	<div class="card">
		<div class="dao-wrapper">
			<RankingTable {projectsData} />
		</div>
	</div>
</section>
