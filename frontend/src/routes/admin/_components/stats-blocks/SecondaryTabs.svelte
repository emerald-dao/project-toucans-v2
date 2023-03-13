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
			<Tab><span class="xsmall">Main Holders</span></Tab>
		</TabList>
		<div class="panels-wrapper">
			<TabPanel>
				<MainFundersList {daoData} />
			</TabPanel>
			<TabPanel>
				<MainHoldersList {daoData} />
			</TabPanel>
		</div>
	</Tabs>
</div>

<style lang="scss">
	.main-wrapper {
		padding-inline: var(--space-5);

		.panels-wrapper {
			overflow-y: auto;
		}
	}
</style>
