<script lang="ts">
	import TagToggle from './atoms/TagToggle.svelte';
	import type {
		FilterNBASlugs,
		NBAFilter
	} from '$lib/features/nft-treasury/types/NBATopShot/nba-filter-interface';
	import type {
		FilterNFLSlugs,
		NFLFilter
	} from '$lib/features/nft-treasury/types/NFLAllDay/nfl-filter-interface';

	export let filters: NBAFilter[] | NFLFilter[];

	const addToFilterBucket = (bucket: number, slug: FilterNBASlugs | FilterNFLSlugs) => {
		filters[bucket].filterBucket.push(slug);
		return filters[bucket].filterBucket;
	};

	const deleteFromFilterBucket = (bucket: number, slug: FilterNBASlugs | FilterNFLSlugs) => {
		const index = filters[bucket].filterBucket.indexOf(slug);
		if (index > -1) {
			filters[bucket].filterBucket.splice(index, 1);
		}
		return filters[bucket].filterBucket;
	};
</script>

<div class="column-4">
	{#each filters as filter, i}
		<div>
			<h5>{filter.title}</h5>
			<div class="tags-wrapper">
				{#each filter.filterElement as element}
					<TagToggle
						name={element.slug}
						on:selected={() => (filters[i].filterBucket = addToFilterBucket(i, element.slug))}
						on:unselected={() =>
							(filters[i].filterBucket = deleteFromFilterBucket(i, element.slug))}
					>
						{element.slug}
					</TagToggle>
				{/each}
			</div>
		</div>
	{/each}
</div>

<style type="scss">
	h5 {
		margin-bottom: var(--space-3);
		font-size: var(--font-size-3);
		margin-top: 0;
	}

	.tags-wrapper {
		display: flex;
		flex-direction: row;
		gap: var(--space-2);
		flex-wrap: wrap;
	}
</style>
