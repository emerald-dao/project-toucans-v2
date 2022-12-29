<script type="ts">
	import CommunityProject from './components/sections/CommunityProject.svelte';
	import { DaoType, type CommunityDao, type FinancialDao } from '$lib/types/dao-project.interface';
	import { ProjectSidebarSection } from './components';
	import FinancialProject from './components/sections/FinancialProject.svelte';
	import { financialDaoData } from '$lib/mock/financialDao';

	let daoData: FinancialDao | CommunityDao = financialDaoData;
</script>

<section class="container">
	<div class="main-wrapper">
		<ProjectSidebarSection {daoData} />
		<div class="secondary-wrapper">
			{#if daoData.type === DaoType.Community}
				<CommunityProject {daoData} />
			{:else if daoData.type === DaoType.Financial}
				<FinancialProject {daoData} />
			{/if}
		</div>
	</div>
</section>

<style type="scss">
	.main-wrapper {
		display: flex;
		overflow: hidden;
		max-height: 75vh;
		height: 100%;

		@include mq(medium) {
			display: grid;
			grid-template-columns: 1.3fr 2fr;
			gap: 4rem;
		}
	}
</style>
