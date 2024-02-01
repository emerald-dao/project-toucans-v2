<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	export let selectedCollection: string;
	export let collectionIdentifiers: string[];

	const dispatch = createEventDispatcher();

	const handleCollectionChange = () => {
		dispatch('collectionChange', selectedCollection);
	};
</script>

<div class="column-1">
	<label for="collection">Collection</label>
	<select bind:value={selectedCollection} on:change={handleCollectionChange} name="collection">
		<option value="" disabled selected hidden>Select one collection...</option>
		{#each collectionIdentifiers as collection}
			<option value={collection}>{collection}</option>
		{/each}
	</select>
</div>

<style lang="scss">
	select {
		max-width: 250px;
	}
</style>
