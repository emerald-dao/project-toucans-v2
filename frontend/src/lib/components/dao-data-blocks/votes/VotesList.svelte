<script type="ts">
	import type { DAOProject } from '$lib/types/dao-project/dao-project.interface';
	import VotesListElement from './VotesListElement.svelte';

	export let daoData: DAOProject;
</script>

<div class="align-start">
	{#if daoData.votes.length > 0}
		{#each daoData.votes as vote, i}
			<div class="activity-wrapper">
				<VotesListElement {vote} {i} />
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
