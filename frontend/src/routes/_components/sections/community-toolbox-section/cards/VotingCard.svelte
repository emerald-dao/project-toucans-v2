<script lang="ts">
	import * as FeatureCard from '../atoms/feature-card';
	import FeautreLabel from '../../atoms/FeatureLabel.svelte';
	import VotingsWidget from '../../../../p/[projectId]/_components/sections/widgets/VotingsWidget.svelte';
	import { MOCK_DAO } from '../mockDao';
</script>

<FeatureCard.Root>
	<FeatureCard.Header>
		<FeautreLabel icon="mdi:vote" textColor="text">Voting</FeautreLabel>
		<FeatureCard.Heading>
			Embrace transparent governance with
			<FeatureCard.HeadingHighlight>voting rounds</FeatureCard.HeadingHighlight>.
		</FeatureCard.Heading>
	</FeatureCard.Header>
	<FeatureCard.Content>
		<VotingsWidget votingData={MOCK_DAO.votes} />
	</FeatureCard.Content>
</FeatureCard.Root>
