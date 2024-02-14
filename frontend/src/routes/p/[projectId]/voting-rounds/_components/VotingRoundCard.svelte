<script lang="ts">
	import type { VotingRoundStatus } from '../[votingRoundId]/_components/voting-widget/voting-round-status.type.ts';
	import { page } from '$app/stores';
	import type { VotingRound } from '$lib/utilities/api/supabase/fetchAllVotingRounds';
	import VotingElegibility from '../[votingRoundId]/_components/voting-widget/VotingElegibility.svelte';

	export let votingRound: VotingRound;

	$: isUserEligible = true;
	$: userHasVoted = false;
	$: activeRoundStatus = 'upcoming' as VotingRoundStatus;
</script>

<a href={`/p/${$page.params.projectId}/voting-rounds/${votingRound.id}`} class="card-primary">
	<div class="card-header">
		<h3>{votingRound.name}</h3>
		<VotingElegibility {isUserEligible} {userHasVoted} votingStauts={activeRoundStatus} />
		<p>{votingRound.description}</p>
	</div>
	<div class="card-body">
		<div class="row-10">
			<div>
				<p class="date-label w-medium xsmall">Start date</p>
				<p class="small">{new Date(votingRound.start_date).toLocaleDateString()}</p>
			</div>
			<div>
				<p class="date-label w-medium xsmall">End date</p>
				<p class="small">
					{votingRound.end_date
						? new Date(votingRound.end_date).toLocaleDateString()
						: 'No end date'}
				</p>
			</div>
		</div>
	</div>
</a>

<style lang="scss">
	.card-primary {
		text-decoration: none;
		color: inherit;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		gap: var(--space-8);
		border-radius: var(--radius-1);

		.card-header {
			display: flex;
			flex-direction: column;
			gap: var(--space-4);

			h3 {
				font-size: var(--font-size-5);
			}
		}

		.date-label {
			color: var(--clr-text-off);
			text-transform: uppercase;
			letter-spacing: 0.03em;
		}
	}
</style>
