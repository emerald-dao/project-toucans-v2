<script type="ts">
	import RoundsList from '$lib/components/dao-data-blocks/funding-rounds/list/RoundsList.svelte';
	import type { DAOProject } from '$lib/types/dao-project/dao-project.interface';
	import { getContext } from 'svelte';
	import type { Writable } from 'svelte/store';
	import RoundGeneratorModal from '$lib/features/round-generator/components/RoundGeneratorModal.svelte';
	import * as AdminPage from '../_components/admin-page';

	const adminData: {
		activeDao: Writable<number>;
		userDaos: Writable<DAOProject[]>;
	} = getContext('admin-data');

	const activeDaoStore = adminData.activeDao;
	const userDaosStore = adminData.userDaos;

	$: activeDaoData = $userDaosStore[$activeDaoStore];
</script>

<AdminPage.Root>
	<AdminPage.Header>
		<AdminPage.Title>Funding Rounds</AdminPage.Title>
	</AdminPage.Header>
	<AdminPage.Container grid={false}>
		<AdminPage.Content>
			{#if activeDaoData.onChainData.fundingCycles.length < 1}
				<AdminPage.EmptyMessage>This project has no funding rounds yet</AdminPage.EmptyMessage>
			{:else}
				<RoundsList daoData={activeDaoData} />
			{/if}
			<RoundGeneratorModal daoData={activeDaoData} />
		</AdminPage.Content>
	</AdminPage.Container>
</AdminPage.Root>
