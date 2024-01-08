<script lang="ts">
	import { onDestroy } from 'svelte';
	import { createSearchStore, searchHandler } from './searchStore';

	export let items: any[];
	export let searchTerms: string[];
	export let filteredItems;
	export let placeholder = 'Search';

	$: searchStore = createSearchStore(searchItem);

	$: filteredItems = $searchStore.filtered;

	const resolveSearchTerm = (item: any) => {
		let resolvedSearchTerms = searchTerms.map((term) => item[term]);
		return resolvedSearchTerms.join(' ').toLowerCase();
	};

	$: searchItem = items.map((item) => ({
		...item,
		searchTerms: resolveSearchTerm(item)
	}));

	$: unsubscribe = searchStore.subscribe((model) => searchHandler(model));

	onDestroy(() => {
		unsubscribe();
	});
</script>

<input type="text" {placeholder} bind:value={$searchStore.search} />

<style>
	input {
		max-width: 30ch;
	}
</style>
