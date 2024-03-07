<script type="ts">
	import PendingActionsListElement from '$lib/components/dao-data-blocks/pending-actions/list/PendingActionsListElement.svelte';
	import { user } from '$lib/stores/flow/FlowStore';
	import { fly } from 'svelte/transition';
	import ConnectPage from '$components/atoms/ConnectPage.svelte';
	import { notifications } from '$lib/features/notifications/stores/NotificationsStore';
	import { supabase } from '$lib/supabaseClient';
	import type { ActionData } from '$lib/types/dao-project/dao-project.interface';
	import Icon from '@iconify/svelte';
	import { Button, Seo } from '@emerald-dao/component-library';
	import OpenGraph from '$components/OpenGraph.svelte';

	let allNotifications: { project: string; notification: ActionData }[] = [];
	let currentPage = 1;
	const pageSize = 10;

	const nextPage = () => {
		currentPage += 1;
	};

	const prevPage = () => {
		currentPage -= 1;
	};

	const getDaosData = async () => {
		if ($notifications) {
			const { data } = await supabase
				.from('projects')
				.select()
				.in('project_id', Object.keys($notifications));

			if (data) {
				return data.reduce((acc, project) => {
					acc[project.project_id] = project;
					return acc;
				}, {});
			} else {
				return {};
			}
		} else {
			return {};
		}
	};

	$: if ($notifications) {
		allNotifications = Object.entries($notifications).flatMap(
			([project, notifications]: [string, ActionData[]]) =>
				notifications.map((notification: ActionData) => ({ project, notification }))
		);
	}

	$: pageStart = (currentPage - 1) * pageSize;
	$: pageEnd = pageStart + pageSize;
	$: pagesNumbers = Array.from(Array(Math.ceil(allNotifications.length / pageSize)).keys());
	$: currentPageNotifications = allNotifications.slice(pageStart, pageEnd);
</script>

<OpenGraph title="Signatures Queue" />

{#if !$user.addr}
	<ConnectPage />
{:else}
	<section in:fly={{ x: 10, duration: 400 }} class="container column-4">
		<div>
			<h5>Signatures Queue</h5>
			<p class="small">Actions waiting for signatures</p>
		</div>
		<div>
			{#if $notifications}
				{#await getDaosData() then daosData}
					{#each currentPageNotifications as { project, notification }}
						<PendingActionsListElement
							action={notification}
							threshold={notification.threshold}
							daoId={project}
							isSigner={notification.signers.includes($user.addr)}
							daoLogo={daosData[project].logo}
							projectOwner={daosData[project].owner}
						/>
					{:else}
						<p class="small"><em>No pending actions</em></p>
					{/each}
				{/await}
			{:else}
				<p class="small"><em>No pending actions</em></p>
			{/if}
		</div>
		{#if pagesNumbers.length > 1}
			<div class="pagination row-4">
				<Button
					on:click={prevPage}
					state={currentPage === 1 ? 'disabled' : 'active'}
					type="transparent"
					color="neutral"
				>
					<Icon icon="tabler:arrow-left" />
				</Button>
				<Button
					on:click={nextPage}
					state={pageEnd >= allNotifications.length ? 'disabled' : 'active'}
					type="transparent"
					color="neutral"
				>
					<Icon icon="tabler:arrow-right" />
				</Button>
			</div>
		{/if}
	</section>
{/if}

<style lang="scss">
	h5 {
		margin-bottom: var(--space-2);
		margin-top: 0;
	}
</style>
