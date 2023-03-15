<script type="ts">
	import type { DAOProject } from '$lib/types/dao-project/dao-project.interface';
	import EventsListElement from './EventsListElement.svelte';

	export let daoData: DAOProject;

	$: recentActivity = daoData.events
		? daoData.events.sort((a, b) => b.timestamp - a.timestamp).slice(0, 6)
		: [];
</script>

<div class="align-start">
	{#if recentActivity.length > 0}
		{#each recentActivity as event, i}
			<div class="activity-wrapper">
				<EventsListElement {event} {i} />
			</div>
		{/each}
	{:else}
		<div class="no-events-wrapper">
			<span class="small"><em>This DAO has no events yet</em></span>
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
</style>
