<script lang="ts">
	import * as FeatureCard from '../atoms/feature-card';
	import FeautreLabel from '../../atoms/FeatureLabel.svelte';
	import { MOCK_DAO } from '../mockDao';
	import GeneralStats from '../../../../admin/_components/stats-blocks/GeneralStats.svelte';
	import DaoStatsIntro from '../../../../admin/_components/stats-blocks/DaoStatsIntro.svelte';
</script>

<FeatureCard.Root>
	<FeatureCard.Header>
		<FeautreLabel icon="mdi:circle-multiple" textColor="text">Token</FeautreLabel>
		<FeatureCard.Heading>
			<FeatureCard.HeadingHighlight>Flow is a fast</FeatureCard.HeadingHighlight>, decentralized,
			and developer-friendly blockchain.
		</FeatureCard.Heading>
	</FeatureCard.Header>
	<FeatureCard.Content>
		<div class="card">
			<DaoStatsIntro daoData={MOCK_DAO} />
			<GeneralStats daoData={MOCK_DAO} />
		</div>
	</FeatureCard.Content>
</FeatureCard.Root>

<style lang="scss">
	.card {
		background-color: var(--clr-background-primary);
		width: 100%;
	}
</style>
