<script lang="ts">
	import type { DaoRankingData } from '../types/dao-ranking-data.interface';
	import TokenRankingTable from './atoms/TokenRankingTable.svelte';

	export let tokenRankings: DaoRankingData[] = [];
</script>

<TokenRankingTable projectsData={tokenRankings} />
