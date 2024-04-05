<script type="ts">
	import type { DAOProject } from '$lib/types/dao-project/dao-project.interface';
	import { onMount } from 'svelte';
	import PendingActionsList from '$lib/components/dao-data-blocks/pending-actions/list/PendingActionsList.svelte';
	import { getProjectInfo } from '$flow/actions';
	import * as AdminPage from '../_components/admin-page';

	export let data;

	let activeDao = data.activeDao as DAOProject;

	onMount(async () => {
		activeDao.onChainData = await getProjectInfo(
			activeDao.generalInfo.contract_address,
			activeDao.generalInfo.owner,
			activeDao.generalInfo.project_id
		);
	});
</script>

<AdminPage.Root>
	<AdminPage.Header>
		<AdminPage.Title>Actions Queue</AdminPage.Title>
		<AdminPage.Description>Actions waiting for signatures</AdminPage.Description>
	</AdminPage.Header>
	<AdminPage.Container grid={false}>
		{#if activeDao.onChainData.actions.length < 1}
			<AdminPage.EmptyMessage
				>This project has no actions waiting for signatures</AdminPage.EmptyMessage
			>
		{:else}
			<PendingActionsList daoData={activeDao} />
		{/if}
	</AdminPage.Container>
</AdminPage.Root>
