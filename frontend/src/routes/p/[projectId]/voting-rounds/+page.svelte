<script lang="ts">
	import VotingRoundsGrid from '$lib/features/voting-rounds/components/voting-round-card/VotingRoundsGrid.svelte';

	export let data;
</script>

<VotingRoundsGrid
	votingRounds={data.votingRounds}
	daoSigners={data.onChainData.signers}
	tokenContractAddress={data.generalInfo.contract_address}
/>
