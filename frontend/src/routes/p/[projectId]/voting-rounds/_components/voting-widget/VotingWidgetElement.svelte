<script lang="ts">
	import type { VotingRound } from '$lib/utilities/api/supabase/fetchAllVotingRounds';

	export let votingRound: VotingRound;
</script>

<div class="card">
	<div class="column-2">
		<h4>{votingRound.name}</h4>
		{#if votingRound.description}
			<p>{votingRound.description}</p>
		{/if}
		<slot />
	</div>
</div>

<style lang="scss">
	h4 {
		font-size: var(--font-size-4);
	}
</style>
