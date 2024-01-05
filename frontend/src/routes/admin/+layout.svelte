<script type="ts">
	import { Button, Seo } from '@emerald-dao/component-library';
	import { AdminNav } from './_components';
	import { setContext } from 'svelte';
	import { writable, type Writable } from 'svelte/store';
	import { user } from '$stores/flow/FlowStore';
	import type { DAOProject } from '$lib/types/dao-project/dao-project.interface';
	import ConnectPage from '$components/atoms/ConnectPage.svelte';
	import { invalidate } from '$app/navigation';
	import { supabase } from '$lib/supabaseClient';
	import type { DaoEvent } from '$lib/types/dao-project/dao-event/dao-event.type';
	import { getProjectInfo } from '$flow/actions';
	import DesktopOnlyPage from '$components/desktop-only-page/DesktopOnlyPage.svelte';
	import persistentWritable from '$lib/utilities/persistentWritable';

	interface Data {
		projects: DAOProject[];
	}

	export let data: Data;

	let screenSize: number;

	const activeDao = persistentWritable('adminActiveDao', 0, false);

	const daosDataStore: Writable<DAOProject[]> = writable(data.projects, (set) => {
		const getProjectsIds = () => {
			const ids = data.projects.map((project) => project.generalInfo.project_id);

			return ids.join(',');
		};

		const subscription = supabase
			.channel('events')
			.on(
				'postgres_changes',
				{
					event: 'INSERT',
					schema: 'public',
					table: 'events',
					filter: `project_id=in.(${getProjectsIds()})`
				},
				(payload) => {
					const newEvent = payload.new as DaoEvent;
					const projectIndex = data.projects
						.map((project) => project.generalInfo.project_id)
						.indexOf(newEvent.project_id);

					reloadBlockchainData(data.projects[projectIndex], projectIndex);

					$daosDataStore[projectIndex].events?.push(newEvent);

					return set($daosDataStore);
				}
			)
			.subscribe();

		return () => supabase.removeChannel(subscription);
	});

	const reloadBlockchainData = async (projectData: DAOProject, projectIndex: number) => {
		$daosDataStore[projectIndex].onChainData = await getProjectInfo(
			projectData.generalInfo.contract_address,
			projectData.generalInfo.owner,
			projectData.generalInfo.project_id
		);
	};

	$: setContext<{
		activeDao: Writable<number>;
		userDaos: Writable<DAOProject[]>;
	}>('admin-data', {
		userDaos: daosDataStore,
		activeDao
	});

	const onChangeUser = async () => {
		await invalidate('app:admin');
		$daosDataStore = data.projects;
	};

	$: $user.addr && onChangeUser();
</script>

<svelte:window bind:innerWidth={screenSize} />

{#if screenSize < 1040}
	<DesktopOnlyPage />
{:else if !$user.addr}
	<ConnectPage />
{:else if $daosDataStore.length < 1}
	<section class="centered">
		<div class="card-primary column-7 align-center">
			<span>You don't have any DAO yet</span>
			<Button size="large" href="/dao-generator">Create DAO</Button>
		</div>
	</section>
{:else}
	<section class="dashboard-section">
		<AdminNav />
		<div class="main-wrapper">
			<slot />
		</div>
	</section>
{/if}

<Seo
	title={`Admin | Toucans`}
	description={`Manage your DAO's`}
	type="WebPage"
	image="https://toucans.ecdao.org/favicon.png"
/>

<style type="scss">
	section {
		padding: 0;
		display: flex;
		flex: 1;
		overflow: hidden;

		@include mq(medium) {
			display: grid;
			grid-template-columns: 280px auto;
		}

		&.centered {
			align-items: center;
		}

		.main-wrapper {
			padding-block: var(--space-11);
			padding-inline: var(--space-12);
			display: flex;
			flex-direction: column;
			overflow-y: auto;
			padding-inline: var(--space-12) 5vw;
		}

		.card-primary {
			padding: var(--space-12);
			width: fit-content;
			height: fit-content;

			span {
				text-align: center;
				min-width: 18ch;
			}
		}
	}
</style>
