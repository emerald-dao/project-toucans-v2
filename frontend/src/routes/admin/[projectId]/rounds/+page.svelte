<script type="ts">
	import RoundsList from '$lib/components/dao-data-blocks/funding-rounds/list/RoundsList.svelte';
	import RoundGeneratorModal from '$lib/features/round-generator/components/RoundGeneratorModal.svelte';
	import * as AdminPage from '../_components/admin-page';

	export let data;
</script>

<AdminPage.Root>
	<AdminPage.Header>
		<AdminPage.Title>Funding Rounds</AdminPage.Title>
	</AdminPage.Header>
	<AdminPage.Container grid={false}>
		<AdminPage.Content>
			{#if data.activeDao.onChainData.fundingCycles.length < 1}
				<AdminPage.EmptyMessage>This project has no funding rounds yet</AdminPage.EmptyMessage>
			{:else}
				<RoundsList daoData={data.activeDao} />
			{/if}
			<RoundGeneratorModal daoData={data.activeDao} />
		</AdminPage.Content>
	</AdminPage.Container>
</AdminPage.Root>
