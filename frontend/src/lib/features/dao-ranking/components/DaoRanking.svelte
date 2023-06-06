<script lang="ts">
	import type { DaoRankingData } from '../types/dao-ranking-data.interface';
	import DaoRankingTable from './atoms/DaoRankingTable.svelte';

	export let daoRankings: DaoRankingData[] = [];
</script>

<DaoRankingTable projectsData={daoRankings} />
