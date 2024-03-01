<script lang="ts">
	import Image from '$lib/components/Image.svelte';
	import {
		VOTING_NFT_MODES,
		type VotingNftModeSlug
	} from '$lib/features/voting-rounds/constants/votingNftModes';
	import { getCatalogByCollectionIDs } from './../../../../../../flow/actions';
	import * as VotingModeCard from './atoms/index';

	export let nftMode: VotingNftModeSlug;
	export let requiredCollectionId: string | null;
</script>

<VotingModeCard.Root>
	<VotingModeCard.Content>
		<VotingModeCard.Label>{VOTING_NFT_MODES[nftMode].title}</VotingModeCard.Label>
		<VotingModeCard.Description>{VOTING_NFT_MODES[nftMode].description}</VotingModeCard.Description>
	</VotingModeCard.Content>
	{#if requiredCollectionId && nftMode != 'no-nfts'}
		{#await getCatalogByCollectionIDs([requiredCollectionId]) then nftCollections}
			{#if nftCollections}
				{@const nftCollection = Object.values(nftCollections)[0]}
				<VotingModeCard.Details>
					<VotingModeCard.DetailsTitle>
						{nftCollection.name}
					</VotingModeCard.DetailsTitle>
					<Image
						src={nftCollection.image}
						alt={`${nftCollection.name} logo`}
						width="100%"
						height="auto"
					/>
				</VotingModeCard.Details>
			{:else}
				<p>Collection not found</p>
			{/if}
		{/await}
	{/if}
</VotingModeCard.Root>
