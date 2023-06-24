<script lang="ts">
	import { Tab, TabList, TabPanel, Tabs } from '@emerald-dao/component-library';
	import type { DAOProject } from '$lib/types/dao-project/dao-project.interface';
	import { RoundsList, MainFundersList, MainHoldersList } from '$components/dao-data-blocks';

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

		span {
			color: inherit;
		}

		.panels-wrapper {
			overflow-y: auto;
		}
	}
</style>
