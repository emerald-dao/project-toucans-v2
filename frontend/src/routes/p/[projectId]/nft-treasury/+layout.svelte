<script lang="ts">
	import { page } from '$app/stores';
	import CollectionSelector from '$lib/features/nft-treasury/components/nfts-list/atoms/CollectionSelector.svelte';
	import type { DAOProject } from '$lib/types/dao-project/dao-project.interface.js';
	import Icon from '@iconify/svelte';
	import { amountOfNfts } from './_store/amountOfNfts';

	export let data: DAOProject;
</script>

<section class="section-small container column-6">
	<div class="header-wrapper">
		<div class="row-3 align-start">
			<a href={`/p/${$page.params.projectId}`} class="header-link row-1 align-center">
				{$page.params.projectId}
			</a>
			<span>/</span>
			<a href={`/p/${$page.params.projectId}/nft-treasury`} class="header-link row-1 align-center">
				NFT Treasury
			</a>
			{#if $page.params.collectionId}
				<span>/</span>
				<a
					href={`/p/${$page.params.projectId}/nft-treasury/${$page.params.collectionId}`}
					class="header-link row-1 align-center"
				>
					{$page.params.collectionId}
				</a>
			{/if}
		</div>
		<div class="dao-data-wrapper">
			<div class="row-4 align-center">
				<img src={`${data.generalInfo.logo}`} alt="DAO logo" width="50px" height="50px" />
				<div class="column-1 align-start">
					<h1>
						{data.generalInfo.name}
					</h1>
					<span> NFTs Treasury </span>
				</div>
			</div>
			<CollectionSelector
				collectionIdentifiers={data.onChainData.allowedNFTCollections}
				selectedCollection={$page.params.collectionId ? $page.params.collectionId : undefined}
				forExternalPage={true}
				label=""
			/>
			<div>
				{#if $amountOfNfts === 'loading'}
					<p class="row-2 align-center">
						<Icon icon="svg-spinners:ring-resize" width="0.8rem" inline />
						NFTs
					</p>
				{:else}
					<p>
						{$amountOfNfts}
						{$amountOfNfts === 1 ? ' NFT' : ' NFTs'}
					</p>
				{/if}
			</div>
		</div>
	</div>
	<div class="main-wrapper">
		<slot />
	</div>
</section>

<style lang="scss">
	section {
		flex: 1;

		.header-wrapper {
			z-index: 1;
			display: grid;
			gap: var(--space-4);

			img {
				border-radius: var(--radius-0);
				border: 1px solid var(--clr-border-primary);
			}

			h1 {
				font-size: var(--font-size-4);
				text-align: center;
			}

			span {
				color: var(--clr-text-off);
				font-size: var(--font-size-2);
				text-align: center;
			}
		}

		.dao-data-wrapper {
			display: flex;
			flex-direction: column;
			gap: var(--space-6);
			margin-top: var(--space-4);

			@include mq('small') {
				flex-direction: row;
				justify-content: space-between;
				align-items: center;
				gap: var(--space-15);
			}
		}

		.main-wrapper {
			flex: 1;
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
		}
	}
</style>
