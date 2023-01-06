<script type="ts">
	import CommunityProject from './components/sections/CommunityProject.svelte';
	import { DaoType, type CommunityDao, type FinancialDao } from '$lib/types/dao-project.interface';
	import { ProjectSidebarSection } from './components';
	import FinancialProject from './components/sections/FinancialProject.svelte';
	import { financialDaoData } from '$lib/mock/financialDao';

	import SeeMoreSidebar from './components/atoms/SeeMoreSidebar.svelte';
	import Icon from '@iconify/svelte';
	import { communityDaoData } from '$lib/mock/communityDao';

	let seeMore = false;

	let daoData: FinancialDao | CommunityDao = communityDaoData;
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
		flex-direction: column;
		overflow: hidden;
		height: 100%;

		@include mq(medium) {
			display: grid;
			grid-template-columns: 1.3fr 2fr;
			gap: 4rem;
			max-height: 75vh;
		}

		.secondary-wrapper {
			margin-top: var(--space-10);

			@include mq(medium) {
				margin-top: 0;
			}
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
		background-color: rgba(255, 102, 196, 0.1);
		p {
			color: var(--clr-tertiary-main);
		}
	}
</style>
