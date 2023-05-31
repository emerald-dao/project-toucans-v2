<script type="ts">
	import { getFindNamesBatch } from '$flow/utils';
	import type { DAOProject } from '$lib/types/dao-project/dao-project.interface';
	import EventsListElement from './EventsListElement.svelte';
	import { getUsersFromEvents } from './functions/getUsersFromEvents';

	export let daoData: DAOProject;

	$: recentActivity = daoData.events
		? daoData.events
				.sort((a, b) => (a.timestamp < b.timestamp ? 1 : a.timestamp > b.timestamp ? -1 : 0))
				.slice(0, 6)
		: [];
	$: addressList = getUsersFromEvents(recentActivity);
</script>

<div class="align-start">
	{#if recentActivity.length > 0}
		{#await getFindNamesBatch(addressList) then findNames}
			{#each recentActivity as event, i}
				<div class="activity-wrapper">
					<EventsListElement {event} {i} {daoData} {findNames} />
				</div>
			{/each}
		{/await}
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
