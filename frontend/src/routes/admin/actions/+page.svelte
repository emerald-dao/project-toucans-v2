<script type="ts">
	import type { DAOProject } from '$lib/types/dao-project/dao-project.interface';
	import { getContext, onMount } from 'svelte';
	import type { Writable } from 'svelte/store';
	import PendingActionsList from '$lib/components/dao-data-blocks/pending-actions/list/PendingActionsList.svelte';
	import { getProjectInfo } from '$flow/actions';
	import * as AdminPage from '../_components/admin-page';

	const adminData: {
		activeDao: Writable<number>;
		userDaos: Writable<DAOProject[]>;
	} = getContext('admin-data');

	const activeDaoStore = adminData.activeDao;
	const userDaosStore = adminData.userDaos;

	$: activeDaoData = $userDaosStore[$activeDaoStore];

	onMount(async () => {
		activeDaoData.onChainData = await getProjectInfo(
			activeDaoData.generalInfo.contract_address,
			activeDaoData.generalInfo.owner,
			activeDaoData.generalInfo.project_id
		);
	});
</script>

<AdminPage.Root>
	<AdminPage.Header>
		<AdminPage.Title>Actions Queue</AdminPage.Title>
		<AdminPage.Description>Actions waiting for signatures</AdminPage.Description>
	</AdminPage.Header>
	<AdminPage.Container grid={false}>
		{#if activeDaoData.onChainData.actions.length < 1}
			<AdminPage.EmptyMessage
				>This project has no actions waiting for signatures</AdminPage.EmptyMessage
			>
		{:else}
			<PendingActionsList daoData={activeDaoData} />
		{/if}
	</AdminPage.Container>
</AdminPage.Root>
