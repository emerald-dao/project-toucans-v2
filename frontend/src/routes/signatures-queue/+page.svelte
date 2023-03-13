<script type="ts">
	import { user } from '$lib/stores/flow/FlowStore';
	import { fly } from 'svelte/transition';
	import ConnectPage from '$components/atoms/ConnectPage.svelte';
	import PendingActionsListElement from '$components/dao-data-blocks/pending-actions/PendingActionsListElement.svelte';
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
			<PendingActionsListElement
				actionType="Withdraw"
				actionId="0x3213"
				signed={true}
				daoId="some-dao-name"
			/>
			<PendingActionsListElement
				actionType="AddSigner"
				actionId="0x3213"
				signed={false}
				daoId="some-dao-name"
			/>
			<PendingActionsListElement
				actionType="RemoveSigner"
				actionId="0x3213"
				signed={true}
				daoId="some-dao-name"
			/>
		</div>
	</section>
{/if}

<style lang="scss">
	h5 {
		margin-bottom: var(--space-2);
		margin-top: 0;
	}
</style>
