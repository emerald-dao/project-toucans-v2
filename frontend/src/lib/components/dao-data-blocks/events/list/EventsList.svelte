<script type="ts">
	import EventsListElement from './EventsListElement.svelte';
	import { getFindNamesBatch } from '$flow/utils';
	import type { DAOProject } from '$lib/types/dao-project/dao-project.interface';
	import { Button } from '@emerald-dao/component-library';
	import Icon from '@iconify/svelte';
	import AddEventModal from '../addEvent/AddEventModal.svelte';
	import { getUsersFromEvents } from '../functions/getUsersFromEvents';

	export let daoData: DAOProject;
	export let pageSize = 6;
	export let addEventButton = true;

	let currentPage = 1;

	const nextPage = () => {
		currentPage += 1;
	};

	const prevPage = () => {
		currentPage -= 1;
	};

	$: pageStart = (currentPage - 1) * pageSize;
	$: pageEnd = pageStart + pageSize;
	$: pagesNumbers = Array.from(Array(Math.ceil(daoData.events.length / pageSize)).keys());
	$: currentPageEvents = daoData.events.slice(pageStart, pageEnd);

	$: addressList = getUsersFromEvents(currentPageEvents);
</script>

<div class="align-start">
	{#if currentPageEvents.length > 0}
		{#await getFindNamesBatch(addressList) then findNames}
			{#each currentPageEvents as event, i}
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
	{#if pagesNumbers.length > 1}
		<div class="pagination row-space-between">
			<div class="row-4">
				<Button
					on:click={prevPage}
					state={currentPage === 1 ? 'disabled' : 'active'}
					type="transparent"
					color="neutral"
				>
					<Icon icon="tabler:arrow-left" />
				</Button>
				<Button
					on:click={nextPage}
					state={pageEnd >= daoData.events.length ? 'disabled' : 'active'}
					type="transparent"
					color="neutral"
				>
					<Icon icon="tabler:arrow-right" />
				</Button>
			</div>
			{#if addEventButton}
				<AddEventModal projectId={daoData.generalInfo.project_id} />
			{/if}
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
