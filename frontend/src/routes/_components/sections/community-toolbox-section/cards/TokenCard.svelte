<script lang="ts">
	import type { DAOProject } from '$lib/types/dao-project/dao-project.interface';
	import * as FeatureCard from '../atoms/feature-card';
	import FeautreLabel from '../../atoms/FeatureLabel.svelte';
	import DaoStatsIntro from '../../../../admin/[projectId]/_components/stats-blocks/DaoStatsIntro.svelte';
	import GeneralStats from '../../../../admin/[projectId]/_components/stats-blocks/GeneralStats.svelte';

	export let daoData: DAOProject;
</script>

<FeatureCard.Root>
	<FeatureCard.Header>
		<FeautreLabel icon="mdi:circle-multiple" textColor="text">Token</FeautreLabel>
		<FeatureCard.Heading>
			<FeatureCard.HeadingHighlight>Create and manage a token</FeatureCard.HeadingHighlight>. We
			deploy a smart contract directly to your account.
		</FeatureCard.Heading>
	</FeatureCard.Header>
	<FeatureCard.Content>
		<div class="card">
			<DaoStatsIntro {daoData} showAdminButtons={false} />
			<GeneralStats {daoData} />
		</div>
	</FeatureCard.Content>
</FeatureCard.Root>

<style lang="scss">
	.card {
		background-color: var(--clr-background-primary);
		width: 100%;
	}
</style>
