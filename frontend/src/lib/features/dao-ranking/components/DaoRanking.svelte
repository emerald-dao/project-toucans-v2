<script lang="ts">
	import type { DaoRankingData } from '../types/dao-ranking-data.interface';
	import DaoRankingTable from './atoms/DaoRankingTable.svelte';
	import TokenRankingTable from './atoms/TokenRankingTable.svelte';

	export let daoRankings: DaoRankingData[] = [];
	export let tokenRankings: DaoRankingData[] = [];
</script>

<section class="container">
	<div class="card">
		<div class="dao-wrapper">
			<DaoRankingTable projectsData={daoRankings} />
		</div>
	</div>
</section>

<section class="container">
	<div class="card">
		<div class="dao-wrapper">
			<TokenRankingTable projectsData={tokenRankings} />
		</div>
	</div>
</section>
