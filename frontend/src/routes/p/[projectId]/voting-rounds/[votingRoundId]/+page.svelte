<script lang="ts">
	import { page } from '$app/stores';
	import VotingWidget from './_components/voting-widget/VotingWidget.svelte';

	export let data;

	$: roundData = data.votingRounds.find((round) => round.id === Number($page.params.votingRoundId));
	$: roundIndex = data.votingRounds.findIndex(
		(round) => round.id === Number($page.params.votingRoundId)
	);

	$: nextVotingRoundId = data.votingRounds[roundIndex + 1]?.id;
	$: previousVotingRoundId = data.votingRounds[roundIndex - 1]?.id;
</script>

{#if roundData}
	<div class="main-wrapper">
		<VotingWidget votingRound={data.votingRounds[roundIndex]} />
		<div class="row-3 row-space-between">
			<a
				href={`/p/${$page.params.projectId}/voting-rounds/${previousVotingRoundId}`}
				disabled={roundIndex === 0}>Previous round</a
			>
			<a
				href={`/p/${$page.params.projectId}/voting-rounds/${nextVotingRoundId}`}
				disabled={roundIndex === data.votingRounds.length - 1}>Next round</a
			>
		</div>
	</div>
{:else}
	<em>We couldn't find the indicated voting round</em>
{/if}

<style lang="scss">
	.main-wrapper {
		display: flex;
		flex: 1;
		flex-direction: column;
		justify-content: space-between;
		gap: var(--space-5);
	}
</style>
