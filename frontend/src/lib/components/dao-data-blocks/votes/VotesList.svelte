<script type="ts">
	import type { Vote } from '$lib/types/dao-project/bot-votes/votes.interface';
	import type { DAOProject } from '$lib/types/dao-project/dao-project.interface';
	import VotesListElement from './VotesListElement.svelte';

	export let daoData: DAOProject;

	function getVoteStatus(vote: Vote) {
		console.log(vote);
		if (vote.type === 'Toucans Action') {
			if (daoData.onChainData.completedActionIds[vote.toucans_action_id] === true) {
				return 'ACCEPTED';
			} else if (daoData.onChainData.completedActionIds[vote.toucans_action_id] === false) {
				return 'DECLINED';
			}
			return 'PENDING';
		}
		if (vote.pending) {
			return 'PENDING';
		} else if (vote.for_total >= vote.against_total) {
			return 'ACCEPTED';
		}
		return 'DECLINED';
	}
</script>

<div class="align-start">
	{#if daoData.votes.length > 0}
		{#each daoData.votes as vote, i}
			<div class="activity-wrapper">
				<VotesListElement {vote} {i} status={getVoteStatus(vote)} />
			</div>
		{/each}
	{:else}
		<div class="no-events-wrapper">
			<span class="small"><em>This DAO has no votes yet. Votes are created in Discord.</em></span>
		</div>
	{/if}
</div>

<style type="scss">
	.activity-wrapper {
		display: flex;
		align-items: center;
		justify-content: space-between;
		width: 100%;
		padding: var(--space-2);
		border-bottom: 1px solid var(--clr-neutral-badge);
	}

	.no-events-wrapper {
		display: flex;
		margin-top: var(--space-4);

		em {
			color: var(--clr-text-off);
		}
	}

	.pagination {
		margin-top: var(--space-3);
	}
</style>
