<script lang="ts">
	import * as FeatureCard from '../atoms/feature-card';
	import FeautreLabel from '../../atoms/FeatureLabel.svelte';
	import TreasuryWallet from '../../../../admin/_components/stats-blocks/TreasuryWallet.svelte';
	import { MOCK_DAO } from '../mockDao';
</script>

<FeatureCard.Root gridArea="card3">
	<FeatureCard.Header>
		<FeautreLabel icon="mdi:treasure-chest" textColor="text">Multisig Treasury</FeautreLabel>
		<FeatureCard.Heading>
			<FeatureCard.HeadingHighlight>Flow is a fast</FeatureCard.HeadingHighlight>, decentralized,
			and developer-friendly blockchain.
		</FeatureCard.Heading>
	</FeatureCard.Header>
	<FeatureCard.Content>
		<TreasuryWallet color="neutral" daoData={MOCK_DAO} />
		<!-- <div class="row-3">
			<img src="/transactions.png" alt="Flow developers" />
			<img src="/treasuryWallet.png" alt="Flow developers" />
		</div> -->
	</FeatureCard.Content>
</FeatureCard.Root>
