<script lang="ts">
	import * as FeatureCard from '../atoms/feature-card';
	import FeautreLabel from '../../atoms/FeatureLabel.svelte';
	import ProjectFundingWidget from '../../../../p/[projectId]/_components/sections/widgets/ProjectFundingWidget.svelte';
	import { MOCK_DAO } from '../mockDao';
</script>

<FeatureCard.Root gridArea="card2">
	<FeatureCard.Header>
		<FeautreLabel icon="mdi:account-cash" textColor="text">Fundrising</FeautreLabel>
		<FeatureCard.Heading>
			<FeatureCard.HeadingHighlight>Flow is a fast</FeatureCard.HeadingHighlight>, decentralized,
			and developer-friendly blockchain.
		</FeatureCard.Heading>
	</FeatureCard.Header>
	<FeatureCard.Content>
		<ProjectFundingWidget daoData={MOCK_DAO} />
	</FeatureCard.Content>
</FeatureCard.Root>
