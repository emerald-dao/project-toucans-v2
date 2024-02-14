<script lang="ts">
	import { page } from '$app/stores';
	import type { VotingRound } from '$lib/utilities/api/supabase/fetchAllVotingRounds';

	export let votingRound: VotingRound;
</script>

<a href={`/p/${$page.params.projectId}/voting-rounds/${votingRound.id}`} class="card-primary">
	<div class="card-header">
		<h3>{votingRound.name}</h3>
		<p>{votingRound.description}</p>
	</div>
	<div class="card-body">
		<div class="row-3">
			<p>Start date: {new Date(votingRound.start_date).toLocaleDateString()}</p>
			<p>
				End date: {votingRound.end_date
					? new Date(votingRound.end_date).toLocaleDateString()
					: 'No end date'}
			</p>
		</div>
	</div>
</a>

<style lang="scss">
	.card-primary {
		text-decoration: none;
		color: inherit;
		display: flex;
		flex-direction: column;
		gap: var(--space-4);
		border-radius: var(--radius-1);

		.card-header {
			display: flex;
			flex-direction: column;
			gap: var(--space-2);

			h3 {
				font-size: var(--font-size-5);
			}
		}
	}
</style>
