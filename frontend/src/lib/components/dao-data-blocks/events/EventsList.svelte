<script type="ts">
	import type { DAOProject } from '$lib/types/dao-project/dao-project.interface';
	import EventsListElement from './EventsListElement.svelte';

	export let daoData: DAOProject;

	$: recentActivity = daoData.events
		? daoData.events.sort((a, b) => b.timestamp - a.timestamp).slice(0, 6)
		: [];
</script>

<div class="align-start">
	{#each recentActivity as event, i}
		<div class="activity-wrapper">
			<EventsListElement {event} {i} />
		</div>
	{/each}
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
</style>
