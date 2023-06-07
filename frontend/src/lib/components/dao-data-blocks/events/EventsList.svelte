<script type="ts">
	import { getFindNamesBatch } from '$flow/utils';
	import type { DAOProject } from '$lib/types/dao-project/dao-project.interface';
	import { Button } from '@emerald-dao/component-library';
	import EventsListElement from './EventsListElement.svelte';
	import { getUsersFromEvents } from './functions/getUsersFromEvents';
	import Icon from '@iconify/svelte';

	export let daoData: DAOProject;
	let currentPage = 1;
	const pageSize = 6;

	const nextPage = () => {
		currentPage += 1;
	};

	const prevPage = () => {
		currentPage -= 1;
	};

	async function saveEvent(transactionId: string) {
		const res = await fetch('/api/save-event-data', {
			method: 'POST',
			body: JSON.stringify({
				transactionId
			}),
			headers: {
				'content-type': 'application/json'
			}
		});

		const response = await res.json();

		return {
			state: 'success',
			errorMessage: response
		};
	}

	$: allActivity = daoData.events
		? daoData.events.sort((a, b) =>
				a.timestamp < b.timestamp ? 1 : a.timestamp > b.timestamp ? -1 : 0
		  )
		: [];
	$: pageStart = (currentPage - 1) * pageSize;
	$: pageEnd = pageStart + pageSize;
	$: pagesNumbers = Array.from(Array(Math.ceil(daoData.events.length / pageSize)).keys());
	$: currentPageEvents = allActivity.slice(pageStart, pageEnd);

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
		<div class="pagination row-4">
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
				state={pageEnd >= allActivity.length ? 'disabled' : 'active'}
				type="transparent"
				color="neutral"
			>
				<Icon icon="tabler:arrow-right" />
			</Button>
			<Button on:click={() => null} type="transparent" color="neutral">
				<Icon icon="tabler:plus" />
			</Button>
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
