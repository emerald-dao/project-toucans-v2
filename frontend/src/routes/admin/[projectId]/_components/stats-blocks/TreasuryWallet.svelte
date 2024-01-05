<script lang="ts">
	import IconCircle from '$components/atoms/IconCircle.svelte';
	import type { DAOProject } from '$lib/types/dao-project/dao-project.interface';
	import { Currency } from '@emerald-dao/component-library';

	export let daoData: DAOProject;
	export let color: 'primary' | 'neutral' = 'primary';
</script>

<div class={`main-wrapper ${color}`}>
	<div class="title-wrapper row-2 align-center">
		<IconCircle icon="tabler:wallet" color="primary" />
		<h4>Treasury Wallet</h4>
	</div>
	<div class="currencies-wrapper column-3">
		{#each Object.entries(daoData.onChainData.treasuryBalances) as [token, balance]}
			<Currency
				amount={Number(balance)}
				currency={token}
				color="heading"
				fontSize="var(--font-size-4)"
			/>
		{/each}
	</div>
</div>

<style lang="scss">
	.main-wrapper {
		text-decoration: none;
		color: var(--clr-font-text);
		border-radius: var(--radius-4);
		overflow: hidden;

		&.primary {
			background-color: var(--clr-primary-badge);
		}

		&.neutral {
			background-color: transparent;
			border: 1px solid var(--clr-border-primary);

			.title-wrapper {
				background-color: transparent;
				border-bottom: 0.5px solid var(--clr-border-primary);
			}
		}

		.title-wrapper {
			border-bottom: 2px solid var(--clr-background-primary);
			background-color: var(--clr-primary-badge);
			transition: 0.4s;

			h4 {
				font-size: var(--font-size-2);
			}
		}

		.title-wrapper,
		.currencies-wrapper {
			padding-inline: var(--space-9);
			padding-block: var(--space-5);
		}
	}
</style>
