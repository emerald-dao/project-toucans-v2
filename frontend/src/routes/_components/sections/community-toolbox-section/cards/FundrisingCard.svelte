<script lang="ts">
	import * as FeatureCard from '../atoms/feature-card';
	import FeautreLabel from '../../atoms/FeatureLabel.svelte';
	import ProjectFundingWidget from '../../../../p/[projectId]/_components/sections/widgets/ProjectFundingWidget.svelte';
	import { MOCK_DAO } from '../mockDao';
</script>

<FeatureCard.Root>
	<FeatureCard.Header>
		<FeautreLabel icon="mdi:account-cash" textColor="text">Fundrising</FeautreLabel>
		<FeatureCard.Heading>
			<FeatureCard.HeadingHighlight>Recieve funding and donations</FeatureCard.HeadingHighlight> transparently
			and securely.
		</FeatureCard.Heading>
	</FeatureCard.Header>
	<FeatureCard.Content>
		<ProjectFundingWidget daoData={MOCK_DAO} />
	</FeatureCard.Content>
</FeatureCard.Root>
