<script lang="ts">
	import type { DAOProject } from '$lib/types/dao-project/dao-project.interface';

	export let daoData: DAOProject;
</script>

<div class="main-wrapper column-3">
	<h4>Signers</h4>
	<div class="row-3">
		{#each daoData.onChainData.signers as signer}
			<img src="/avatar-2.png" alt="signer-avatar" />
		{/each}
		<a class="round-button center" href="/admin/multisig">+</a>
	</div>
</div>

<style lang="scss">
	.main-wrapper {
		padding: var(--space-3) var(--space-5);
		border-top: 0.5px var(--clr-border-primary) solid;

		h4 {
			font-size: var(--font-size-2);
			color: var(--clr-font-text);
		}

		img {
			width: 40px;
			height: 40px;
			border-radius: 50%;
		}

		.round-button {
			width: 40px;
			height: 40px;
			border-radius: 50%;
			background-color: var(--clr-background-secondary);
			color: var(--clr-text-off);
			border: none;
			text-decoration: none;
		}
	}
</style>
