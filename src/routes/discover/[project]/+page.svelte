<script type="ts">
	import CommunityProject from './components/sections/CommunityProject.svelte';
	import { DaoType, type CommunityDao, type FinancialDao } from '$lib/types/dao-project.interface';
	import { ProjectSidebarSection } from './components';
	import FinancialProject from './components/sections/FinancialProject.svelte';
	import { financialDaoData } from '$lib/mock/financialDao';
	import SeeMoreSidebar from './components/atoms/SeeMoreSidebar.svelte';
	import Icon from '@iconify/svelte';

	export let data;
	console.log(data);
	let seeMore = false;

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
	<div class="button" on:click={() => (seeMore = !seeMore)} on:keydown>
		<Icon icon="tabler:arrow-left" color="#ff66c4" width="19.5" />
		<p class="xsmall w-medium">More</p>
	</div>

	{#if seeMore}
		<SeeMoreSidebar on:closeModal={() => (seeMore = !seeMore)} />
	{/if}
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
	.button {
		position: fixed;
		right: 0;
		top: 20vh;
		display: flex;
		align-items: center;
		padding: var(--space-2) var(--space-4);
		border: solid 1px var(--clr-tertiary-main);
		border-radius: var(--radius-1) 0px 0px var(--radius-1);
		cursor: pointer;

		p {
			color: var(--clr-tertiary-main);
		}
	}
</style>
