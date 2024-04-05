<script type="ts">
	import PendingActionsList from '$lib/components/dao-data-blocks/pending-actions/list/PendingActionsList.svelte';
	import * as AdminPage from '../_components/admin-page';

	export let data;
</script>

<AdminPage.Root>
	<AdminPage.Header>
		<AdminPage.Title>Actions Queue</AdminPage.Title>
		<AdminPage.Description>Actions waiting for signatures</AdminPage.Description>
	</AdminPage.Header>
	<AdminPage.Container grid={false}>
		{#if data.activeDao.onChainData.actions.length < 1}
			<AdminPage.EmptyMessage
				>This project has no actions waiting for signatures</AdminPage.EmptyMessage
			>
		{:else}
			<PendingActionsList daoData={data.activeDao} />
		{/if}
	</AdminPage.Container>
</AdminPage.Root>
