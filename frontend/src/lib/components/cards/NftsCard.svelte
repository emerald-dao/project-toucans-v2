<script lang="ts">
	import NFTsList from '$components/atoms/NFTsList.svelte';
	import Icon from '@iconify/svelte';

	export let NFTs: {
		[collectionIdentifier: string]: {
			id: string;
			name: string;
			thumbnail: string;
		}[];
	};

	export let pageSize = 2;
</script>

{#if Object.values(NFTs).some((array) => array.length > 0)}
	<div class="column-3">
		<span class="title">
			<Icon icon="tabler:hexagon" />
			NFTs Treasury
		</span>
		<div class="card" style="padding: var(--space-8) var(--space-8) var(--space-5);">
			<NFTsList {NFTs} {pageSize} />
		</div>
	</div>
{/if}

<style lang="scss">
	.title {
		font-size: var(--font-size-1);
		display: flex;
		flex-direction: row;
		align-items: center;
		gap: var(--space-1);
	}
</style>
