<script lang="ts">
	import * as FeatureCard from '../atoms/feature-card';
	import FeautreLabel from '../../atoms/FeatureLabel.svelte';
	import VotingsWidget from '../../../../p/[projectId]/_components/sections/widgets/VotingsWidget.svelte';
	import { MOCK_VOTINGS } from '../mockDao';
</script>

<FeatureCard.Root>
	<FeatureCard.Header>
		<FeautreLabel icon="mdi:vote" textColor="text">Voting</FeautreLabel>
		<FeatureCard.Heading>
			<FeatureCard.HeadingHighlight>Flow is a fast</FeatureCard.HeadingHighlight>, decentralized,
			and developer-friendly blockchain.
		</FeatureCard.Heading>
	</FeatureCard.Header>
	<FeatureCard.Content>
		<VotingsWidget votingData={MOCK_VOTINGS} />
	</FeatureCard.Content>
</FeatureCard.Root>
