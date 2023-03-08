<script type="ts">
	import { fly } from 'svelte/transition';
	import ActionElement from '$components/actions/ActionElement.svelte';
</script>

<section in:fly={{ x: 10, duration: 400 }} class="container-small column-4">
	<div>
		<h5>Signatures Queue</h5>
		<p class="small">Actions waiting for your signature</p>
	</div>
	<div>
		<ActionElement actionType="Withdraw" actionId="0x3213" signed={true} daoId="some-dao-name" />
		<ActionElement
			actionType="NewFundingCycle"
			actionId="0x3213"
			signed={false}
			daoId="some-dao-name"
		/>
		<ActionElement
			actionType="RemoveSigner"
			actionId="0x3213"
			signed={true}
			daoId="some-dao-name"
		/>
	</div>
</section>

<style lang="scss">
	h5 {
		margin-bottom: var(--space-2);
		margin-top: 0;
	}
</style>
