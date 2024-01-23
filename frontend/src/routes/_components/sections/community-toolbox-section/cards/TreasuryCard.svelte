<script lang="ts">
	import * as FeatureCard from '../atoms/feature-card';
	import FeautreLabel from '../../atoms/FeatureLabel.svelte';
	import { MOCK_DAO } from '../mockDao';
	import TreasuryWallet from '../../../../admin/[projectId]/_components/stats-blocks/TreasuryWallet.svelte';
</script>

<FeatureCard.Root>
	<FeatureCard.Header>
		<FeautreLabel icon="mdi:treasure-chest" textColor="text">Multisig Treasury</FeautreLabel>
		<FeatureCard.Heading>
			Manage funds with a <FeatureCard.HeadingHighlight
				>secure multisig treasury. Airdrop, mint, and withdraw
			</FeatureCard.HeadingHighlight> together.
		</FeatureCard.Heading>
	</FeatureCard.Header>
	<FeatureCard.Content>
		<TreasuryWallet color="neutral" daoData={MOCK_DAO} />
	</FeatureCard.Content>
</FeatureCard.Root>
