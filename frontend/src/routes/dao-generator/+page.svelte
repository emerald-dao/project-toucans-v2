<script type="ts">
	import CreateProjectStepsCard from '$lib/components/cards/CreateProjectStepsCard.svelte';
	import { user } from '$stores/flow/FlowStore';
</script>

<section>
	<div class="container center">
		{#if $user?.addr}
			<CreateProjectStepsCard />
		{:else}
			<div class="column-2">
				<h4>Connect Wallet</h4>
				<span>
					Please connect your wallet to create a project.
				</span>
			</div>
		{/if}
	</div>
</section>

<style type="scss">
	section {		
		.container {
			min-height: 70vh;
		}

		h4, span {
			text-align: center;
		}
	}
</style>