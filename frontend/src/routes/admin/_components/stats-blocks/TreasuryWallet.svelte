<script lang="ts">
	import IconCircle from '$components/atoms/IconCircle.svelte';
	import type { DAOProject } from '$lib/types/dao-project/dao-project.interface';
	import { Button, Currency, Label } from '@emerald-dao/component-library';

	export let daoData: DAOProject;
</script>

<a href="/admin/withdraw" class="main-wrapper column-5">
	<div class="row-2 align-center">
		<IconCircle icon="tabler:wallet" color="primary" />
		<h4>Treasury Funds</h4>
	</div>
	{#each Object.entries(daoData.onChainData.treasuryBalances) as [token, balance]}
		<Currency
			amount={Number(balance)}
			currency={token}
			color="heading"
			fontSize="var(--font-size-5)"
		/>
	{/each}
</a>

<style lang="scss">
	.main-wrapper {
		padding: var(--space-7);
		background-color: var(--clr-primary-badge);
		border-radius: var(--radius-5);
		text-decoration: none;
		color: var(--clr-font-text);
		transition: 0.4s;

		h4 {
			font-size: var(--font-size-2);
			color: var(--clr-font-text);
		}

		&:hover {
			background-color: var(--clr-primary-800);
		}
	}
</style>
