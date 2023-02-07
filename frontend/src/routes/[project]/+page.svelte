<script type="ts">
	import CommunityProject from './components/sections/CommunityProject.svelte';
	import { DaoType, type CommunityDao, type FinancialDao } from '$lib/types/dao-project.interface';
	import { ProjectSidebarSection } from './components';
	import FinancialProject from './components/sections/FinancialProject.svelte';
	import { financialDaoData } from '$lib/mock/financialDao';
	import { communityDaoData } from '$lib/mock/communityDao';
	import SeeMoreSidebar from './components/atoms/SeeMoreSidebar.svelte';
	import Icon from '@iconify/svelte';
	import type { FundingCycleAction } from '$lib/types/actions/funding-cycle-action.interface';
	import type { PurchaseAction } from '$lib/types/actions/purchase-action.interface';

	export let data: CommunityDao | FinancialDao;

	console.log('a', data);

	let seeMore = false;
</script>

<section class="container">
	<div class="main-wrapper">
		<div class="project-sidebar-wrapper">
			<ProjectSidebarSection daoData={data} />
		</div>
		<div class="secondary-wrapper">
			{#if data.type === DaoType.Community}
				<CommunityProject daoData={data} />
			{:else if data.type === DaoType.Financial}
				<FinancialProject daoData={data} />
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
		height: 100%;

		@include mq(medium) {
			display: grid;
			grid-template-columns: 1.3fr 2fr;
			gap: 4rem;
		}

		.project-sidebar-wrapper {
			position: relative;
			top: 0;

			@include mq(medium) {
				position: sticky;
				top: var(--space-16);
				height: fit-content;
			}
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
		border-right-width: 0px;
		border-radius: var(--radius-1) 0px 0px var(--radius-1);
		cursor: pointer;
		background-color: var(--clr-tertiary-badge);

		p {
			color: var(--clr-tertiary-main);
		}
	}
</style>
