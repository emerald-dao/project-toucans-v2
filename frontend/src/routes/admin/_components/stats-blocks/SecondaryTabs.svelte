<script lang="ts">
	import MainHoldersList from '$lib/components/dao-data-blocks/holders/list/MainHoldersList.svelte';
	import MainFundersList from '$lib/components/dao-data-blocks/funders/list/MainFundersList.svelte';
	import { Tab, TabList, TabPanel, Tabs } from '@emerald-dao/component-library';
	import type { DAOProject } from '$lib/types/dao-project/dao-project.interface';

	export let daoData: DAOProject;
</script>

<div class="main-wrapper">
	<Tabs>
		<TabList>
			<Tab><span class="xsmall">Main Funders</span></Tab>
			{#if daoData.hasToken}
				<Tab><span class="xsmall">Main Holders</span></Tab>
			{/if}
		</TabList>
		<div class="panels-wrapper">
			<TabPanel>
				<MainFundersList {daoData} />
			</TabPanel>
			{#if daoData.hasToken}
				<TabPanel>
					<MainHoldersList {daoData} />
				</TabPanel>
			{/if}
		</div>
	</Tabs>
</div>

<style lang="scss">
	.main-wrapper {
		padding-inline: var(--space-5);
		flex: 1;
		display: flex;
		flex-direction: column;

		span {
			color: inherit;
		}

		.panels-wrapper {
			flex: 1;
			overflow-y: auto;
		}
	}
</style>
