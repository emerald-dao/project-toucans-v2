<script type="ts">
	import { user } from '$lib/stores/flow/FlowStore';
	import { fly } from 'svelte/transition';
	import ConnectPage from '$components/atoms/ConnectPage.svelte';
	import PendingActionsListElement from '$components/dao-data-blocks/pending-actions/PendingActionsListElement.svelte';
	import { notifications } from '$lib/features/notifications/stores/NotificationsStore';
	import { supabase } from '$lib/supabaseClient';

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
					{#each Object.entries($notifications) as [key, value]}
						{#each value.actions as action}
							<PendingActionsListElement
								{action}
								threshold={value.threshold}
								daoId={key}
								isSigner={value.isSigner}
								daoLogo={daosData[key].logo}
								projectOwner={daosData[key].owner}
							/>
						{/each}
					{/each}
				{/await}
			{:else}
				<p class="small">No pending actions</p>
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
