<script lang="ts">
	import * as FeatureCard from '../atoms/feature-card';
	import FeautreLabel from '../../atoms/FeatureLabel.svelte';
	import { MOCK_DAO } from '../mockDao';
	import VotingWidgetExpanded from '$lib/features/voting-rounds/components/voting-widget/VotingWidgetExpanded.svelte';
</script>

<FeatureCard.Root>
	<FeatureCard.Header>
		<FeautreLabel icon="mdi:vote" textColor="text">Voting</FeautreLabel>
		<FeatureCard.Heading>
			Embrace transparent governance with
			<FeatureCard.HeadingHighlight>voting directly in Discord</FeatureCard.HeadingHighlight>.
		</FeatureCard.Heading>
	</FeatureCard.Header>
	<FeatureCard.Content>
		<div>
			<VotingWidgetExpanded
				votingRound={MOCK_DAO.votingRounds[0]}
				tokenContractAddress={null}
				daoActions={[]}
			/>
		</div>
	</FeatureCard.Content>
</FeatureCard.Root>

<style>
	div {
		bottom: 8rem;
		width: 1100px;
	}
</style>
