<script lang="ts">
	import OpenGraph from '$components/OpenGraph.svelte';
	import { getProjectInfo, getTokenBalance, hasProjectVaultSetup } from '$flow/actions';
	import { supabase } from '$lib/supabaseClient';
	import type { DaoEvent } from '$lib/types/dao-project/dao-event/dao-event.type';
	import type { DAOProject } from '$lib/types/dao-project/dao-project.interface';
	import { user } from '$stores/flow/FlowStore';
	import { onMount, setContext } from 'svelte';
	import { writable, type Writable } from 'svelte/store';

	export let data: DAOProject;

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
	user;

	const reloadUserBalance = async () => {
		if (!data.generalInfo.contract_address) return;
		$daoDataStore.vaultSetup = true;

		if ($user.addr) {
			$daoDataStore.userBalance = await getTokenBalance(
				data.generalInfo.project_id,
				data.generalInfo.contract_address,
				$user.addr
			);
			$daoDataStore.vaultSetup = await hasProjectVaultSetup(
				data.generalInfo.contract_address,
				data.generalInfo.project_id,
				$user.addr
			);
		}
	};

	$: $user.addr && reloadUserBalance();

	onMount(() => {
		let uuidsMap = {};
		let donateNFTEvents = data.events.filter((e) => e.type === 'DonateNFT').reverse();
		for (let i = 0; i < donateNFTEvents.length; i++) {
			let event = donateNFTEvents[i];
			if (event.data.uuids) {
				for (let j = 0; j < event.data.uuids.length; j++) {
					uuidsMap[event.data.uuids[j]] = event.data.by;
				}
			}
		}
		$daoDataStore.generalInfo.nftUuidOwnerMap = uuidsMap;
	});
</script>

<OpenGraph
	image={data.generalInfo.banner_image}
	title={data.generalInfo.name}
	description={data.generalInfo.description}
/>

<slot />
