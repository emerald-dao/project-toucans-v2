<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { createEventDispatcher } from 'svelte';

	export let selectedCollection: string | undefined;
	export let collectionIdentifiers: string[];
	export let forExternalPage: boolean = false;
	export let label: string = 'Collection';

	const dispatch = createEventDispatcher();

	const handleCollectionChange = () => {
		dispatch('collectionChange', selectedCollection);
	};

	const redirectToExternalLink = () => {
		if (selectedCollection) {
			goto(`${$page.url.origin}/p/${$page.params.projectId}/nft-treasury/${selectedCollection}`);
		}
	};
</script>

<div class="column-1">
	<label for="collection">{label}</label>
	<select
		style={!forExternalPage ? `max-width:  250px;` : ''}
		bind:value={selectedCollection}
		on:change={forExternalPage ? redirectToExternalLink : handleCollectionChange}
		name="collection"
	>
		<option value={undefined} disabled selected hidden>Select collection...</option>
		{#each collectionIdentifiers as collection}
			<option value={collection}>{collection}</option>
		{/each}
	</select>
</div>
