<script type="ts">
	import RoundsList from '$lib/components/dao-data-blocks/funding-rounds/list/RoundsList.svelte';
	import RoundGeneratorModal from '$lib/features/round-generator/components/RoundGeneratorModal.svelte';
	import type { DAOProject } from '$lib/types/dao-project/dao-project.interface';
	import * as AdminPage from '../_components/admin-page';

	export let data;

	let activeDao = data.activeDao as DAOProject;
</script>

<AdminPage.Root>
	<AdminPage.Header>
		<AdminPage.Title>Funding Rounds</AdminPage.Title>
	</AdminPage.Header>
	<AdminPage.Container grid={false}>
		<AdminPage.Content>
			{#if activeDao.onChainData.fundingCycles.length < 1}
				<AdminPage.EmptyMessage>This project has no funding rounds yet</AdminPage.EmptyMessage>
			{:else}
				<RoundsList daoData={activeDao} />
			{/if}
			<RoundGeneratorModal daoData={activeDao} />
		</AdminPage.Content>
	</AdminPage.Container>
</AdminPage.Root>
