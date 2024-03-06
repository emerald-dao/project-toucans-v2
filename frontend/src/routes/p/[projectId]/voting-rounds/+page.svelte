<script lang="ts">
	import VotingRoundsGrid from '$lib/features/voting-rounds/components/VotingRoundsGrid.svelte';

	export let data;
</script>

<VotingRoundsGrid votingRounds={data.votingRounds} />
