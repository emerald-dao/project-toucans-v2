<script type="ts">
	import { DiscoverProjectSidebar, DiscoverProjectMain, SeeMoreSidebar } from './_components';
	import { setContext } from 'svelte';
	import type { DAOProject } from '$lib/types/dao-project/dao-project.interface';
	import { writable, type Writable } from 'svelte/store';
	import type { DaoEvent } from '$lib/types/dao-project/dao-event/dao-event.type';
	import { supabase } from '$lib/supabaseClient';
	import { getProjectInfo, getTokenBalance, hasVaultSetup } from '$flow/actions';
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
			$daoDataStore.vaultSetup = await hasVaultSetup(
				data.generalInfo.contract_address,
				data.generalInfo.project_id,
				$user.addr,
				data.generalInfo.token_symbol
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
</style>
