<script lang="ts">
	import type { VotingRound } from '$lib/utilities/api/supabase/fetchAllVotingRounds';
	import { fetchVotingRoundVotes } from '$lib/utilities/api/supabase/fetchVotingRoundVotes';
	import VotingWidgetElement from './VotingWidgetElement.svelte';

	export let votingRounds: VotingRound[];

	let activeRound = 0;

	$: activeRoundData = votingRounds[activeRound];

	$: activeRoundVotes = fetchVotingRoundVotes(activeRoundData.id);
</script>

<div class="column-3">
	<VotingWidgetElement votingRound={activeRoundData}>
		{#await activeRoundVotes}
			banca...
		{:then votes}
			{#each votes as vote}
				<div class="card row-3">
					<span>{vote.name}</span>
					<span>{vote.votes.length}</span>
				</div>
			{/each}
		{/await}
	</VotingWidgetElement>
	<div class="row-3 row-space-between">
		<button on:click={() => activeRound--}>previous</button>
		<button on:click={() => activeRound++}>next</button>
	</div>
</div>
