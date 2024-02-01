<script lang="ts">
	import * as FeatureCard from '../atoms/feature-card';
	import FeautreLabel from '../../atoms/FeatureLabel.svelte';
	import NewBadge from '../atoms/NewBadge.svelte';
	import NFTsList from '$lib/features/nft-treasury/components/nfts-list/NFTsList.svelte';
	import { MOCK_NFTS } from '../mockDao';
	import CollectionSelector from '$lib/features/nft-treasury/components/nfts-list/atoms/CollectionSelector.svelte';
</script>

<FeatureCard.Root>
	<FeatureCard.Header>
		<div class="header-wrapper row-4 row-space-between">
			<FeautreLabel icon="mdi:account-cash" textColor="text">NFT Treasury</FeautreLabel>
			<NewBadge />
		</div>
		<FeatureCard.Heading>
			<FeatureCard.HeadingHighlight>Collect and manage NFTs</FeatureCard.HeadingHighlight> from your
			DAOs multisig treasury.
		</FeatureCard.Heading>
	</FeatureCard.Header>
	<FeatureCard.Content>
		<div class="card-primary">
			<div class="column-3">
				<CollectionSelector selectedCollection="NFLAllDay" collectionIdentifiers={['NFLAllDay']} />
				<NFTsList NFTs={MOCK_NFTS} selectedCollection="NFLAllDay" pageSize={2} />
			</div>
		</div>
	</FeatureCard.Content>
</FeatureCard.Root>

<style lang="scss">
	.header-wrapper {
		width: 100%;
		align-items: center;
	}
</style>
