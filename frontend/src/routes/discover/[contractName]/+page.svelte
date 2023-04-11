<script type="ts">
	import { DiscoverProjectSidebar, DiscoverProjectMain, SeeMoreSidebar } from './_components';
	import { setContext } from 'svelte';
	import type { DAOProject } from '$lib/types/dao-project/dao-project.interface';
	import { writable, type Writable } from 'svelte/store';
	import type { DaoEvent } from '$lib/types/dao-project/dao-event/dao-event.type';
	import { supabase } from '$lib/supabaseClient';
	import { getProjectInfo, getTokenBalance } from '$flow/actions';
	import { user } from '$stores/flow/FlowStore';

	export let data: DAOProject;

	console.log(data);

	let daoDataStore: Writable<DAOProject> = writable(data, (set) => {
		const subscription = supabase
			.channel('events')
			.on(
				'postgres_changes',
				{
					event: 'INSERT',
					schema: 'public',
					table: 'events',
					filter: `project_id=eq.${data.generalInfo.project_id}`
				},
				(payload) => {
					const newEvent = payload.new as DaoEvent;

					reloadBlockchainData();

					if (newEvent.type === 'Purchase' && newEvent.data.by === $user.addr) {
						reloadUserBalance();
					}

					$daoDataStore.events?.push(newEvent);

					return set($daoDataStore);
				}
			)
			.subscribe();

		return () => supabase.removeChannel(subscription);
	});

	setContext('daoData', $daoDataStore);

	const reloadBlockchainData = async () => {
		$daoDataStore.onChainData = await getProjectInfo(
			data.generalInfo.contract_address,
			data.generalInfo.owner,
			data.generalInfo.project_id
		);
	};

	const reloadUserBalance = async () => {
		if ($user.addr) {
			$daoDataStore.userBalance = await getTokenBalance(
				data.generalInfo.project_id,
				data.generalInfo.contract_address,
				$user.addr
			);
		}
	};

	$: $user.addr && reloadUserBalance();
</script>

<section class="container">
	<div class="main-wrapper">
		<div class="project-sidebar-wrapper">
			<DiscoverProjectSidebar daoData={$daoDataStore} />
		</div>
		<div class="secondary-wrapper">
			<DiscoverProjectMain daoData={$daoDataStore} />
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
