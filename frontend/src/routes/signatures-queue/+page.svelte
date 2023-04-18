<script type="ts">
	import { user } from '$lib/stores/flow/FlowStore';
	import { fly } from 'svelte/transition';
	import ConnectPage from '$components/atoms/ConnectPage.svelte';
	import PendingActionsListElement from '$components/dao-data-blocks/pending-actions/PendingActionsListElement.svelte';
	import { notifications } from '$lib/features/notifications/stores/NotificationsStore';
	import { supabase } from '$lib/supabaseClient';
	import { onMount } from 'svelte';
	import type { ActionData } from '$lib/types/dao-project/dao-project.interface';

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

	let allNotifications: { project: string; notification: ActionData }[] = [];

	onMount(() => {
		if ($notifications) {
			allNotifications = Object.entries($notifications).flatMap(
				([project, notifications]: [string, ActionData[]]) =>
					notifications.map((notification: ActionData) => ({ project, notification }))
			);
		}
	});
</script>

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
					{#each allNotifications as { project, notification }}
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
	</section>
{/if}

<style lang="scss">
	h5 {
		margin-bottom: var(--space-2);
		margin-top: 0;
	}
</style>
