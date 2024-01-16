<script lang="ts">
	import * as FeatureCard from '../atoms/feature-card';
	import FeautreLabel from '../../atoms/FeatureLabel.svelte';
	import NewBadge from '../atoms/NewBadge.svelte';
</script>

<FeatureCard.Root>
	<FeatureCard.Header>
		<div class="row-4 row-space-between">
			<FeautreLabel icon="mdi:account-cash" textColor="text">NFT Treasury</FeautreLabel>
			<NewBadge />
		</div>
		<FeatureCard.Heading>
			<FeatureCard.HeadingHighlight>Collect and manage NFTs</FeatureCard.HeadingHighlight> from your
			DAOs multisig treasury
		</FeatureCard.Heading>
	</FeatureCard.Header>
	<FeatureCard.Content>Here goes the NFT widget card!</FeatureCard.Content>
</FeatureCard.Root>

<style lang="scss">
	div {
		width: 100%;
		align-items: center;
	}
</style>
