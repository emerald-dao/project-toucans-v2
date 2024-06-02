<script type="ts">
	import { DiscoverProjectSidebar, DiscoverProjectMain, SeeMoreSidebar } from './_components';
	import { getContext } from 'svelte';
	import Icon from '@iconify/svelte';
	import type { DAOProject } from '$lib/types/dao-project/dao-project.interface';
	import { getTokenBalance, hasProjectVaultSetup } from '$flow/actions';
	import { user } from '$stores/flow/FlowStore';

	export let data: DAOProject;

	let seeMore = false;

	const daoData: DAOProject = getContext('daoData');

	const reloadUserBalance = async () => {
		if (!data.generalInfo.contract_address) return;
		daoData.vaultSetup = true;

		if ($user.addr) {
			daoData.userBalance = await getTokenBalance(
				data.generalInfo.project_id,
				data.generalInfo.contract_address,
				$user.addr
			);
			daoData.vaultSetup = await hasProjectVaultSetup(
				data.generalInfo.contract_address,
				data.generalInfo.project_id,
				$user.addr
			);
		}
	};
</script>

<section class="container">
	<div class="main-wrapper">
		<div class="project-sidebar-wrapper">
			<DiscoverProjectSidebar {daoData} />
		</div>
		<div class="secondary-wrapper">
			<DiscoverProjectMain {daoData} {reloadUserBalance} />
		</div>
	</div>
	{#if data.generalInfo.long_description}
		<div class="hide-on-mobile">
			<div class="button" on:click={() => (seeMore = !seeMore)} on:keydown>
				<Icon icon="tabler:arrow-left" />
				<p class="xsmall w-medium">About us</p>
			</div>
			{#if seeMore}
				<SeeMoreSidebar
					longDescription={data.generalInfo.long_description}
					on:closeModal={() => (seeMore = !seeMore)}
				/>
			{/if}
		</div>
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
				top: var(--space-12);
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
		border-right-width: 0px;
		border-radius: var(--radius-1) 0px 0px var(--radius-1);
		cursor: pointer;
		background-color: var(--clr-surface-secondary);
		gap: var(--space-1);
	}
</style>
