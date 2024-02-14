<script lang="ts">
	import VotingRoundCard from './_components/VotingRoundCard.svelte';

	export let data;
</script>

{#if data.votingRounds.length === 0}
	<em>No voting rounds available</em>
{:else}
	<div class="main-wrapper">
		{#each data.votingRounds as round, index (round.id)}
			<VotingRoundCard votingRound={round} />
		{/each}
	</div>
{/if}

<style lang="scss">
	.main-wrapper {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
		gap: var(--space-8);
	}
</style>
