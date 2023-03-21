<script type="ts">
	import { user } from '$lib/stores/flow/FlowStore';
	import { fly } from 'svelte/transition';
	import ConnectPage from '$components/atoms/ConnectPage.svelte';
	import PendingActionsListElement from '$components/dao-data-blocks/pending-actions/PendingActionsListElement.svelte';
	import { notifications } from '$lib/features/notifications/stores/NotificationsStore';

	console.log($notifications);
</script>

{#if !$user.addr}
	<ConnectPage />
{:else}
	<section in:fly={{ x: 10, duration: 400 }} class="container-small column-4">
		<div>
			<h5>Signatures Queue</h5>
			<p class="small">Actions waiting for your signature</p>
		</div>
		<div>
			{#if $notifications}
				{#each Object.entries($notifications) as [key, value]}
					{#each value.actions as action}
						<PendingActionsListElement {action} threshold={value.threshold} daoId={key} />
					{/each}
				{/each}
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
