<script type="ts">
	import { DiscoverProjectSidebar, DiscoverProjectMain, SeeMoreSidebar } from './_components';
	import Icon from '@iconify/svelte';
	import { setContext } from 'svelte';
	import type { DAOProject } from '$lib/types/dao-project/dao-project.interface';

	export let data: DAOProject;

	setContext('daoData', data);

	// let seeMore = false;
</script>

<section class="container">
	<div class="main-wrapper">
		<div class="project-sidebar-wrapper">
			<DiscoverProjectSidebar daoData={data} />
		</div>
		<div class="secondary-wrapper">
			<DiscoverProjectMain daoData={data} />
		</div>
	</div>
	<!-- <div class="button" on:click={() => (seeMore = !seeMore)} on:keydown>
		<Icon icon="tabler:arrow-left" color="#ff66c4" width="19.5" />
		<p class="xsmall w-medium">More</p>
	</div> -->
	<!-- {#if seeMore}
		<SeeMoreSidebar on:closeModal={() => (seeMore = !seeMore)} />
	{/if} -->
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
	// .button {
	// 	position: fixed;
	// 	right: 0;
	// 	top: 20vh;
	// 	display: flex;
	// 	align-items: center;
	// 	padding: var(--space-2) var(--space-4);
	// 	border: solid 1px var(--clr-tertiary-main);
	// 	border-right-width: 0px;
	// 	border-radius: var(--radius-1) 0px 0px var(--radius-1);
	// 	cursor: pointer;
	// 	background-color: var(--clr-tertiary-badge);

	// 	p {
	// 		color: var(--clr-tertiary-main);
	// 	}
	// }
</style>
