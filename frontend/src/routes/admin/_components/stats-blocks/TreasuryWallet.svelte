<script lang="ts">
	import IconCircle from '$components/atoms/IconCircle.svelte';
	import type { DAOProject } from '$lib/types/dao-project/dao-project.interface';
	import { Button, Currency, Label } from '@emerald-dao/component-library';
	import Icon from '@iconify/svelte';

	export let daoData: DAOProject;
</script>

<a href="/admin/withdraw" class="main-wrapper column-5">
	<div class="row-2 align-center">
		<IconCircle icon="tabler:wallet" color="primary" />
		<h4>Treasury Wallet</h4>
	</div>
	<Currency amount={34321} currency="FLOW" color="heading" fontSize="var(--font-size-6)" />
</a>

<style lang="scss">
	.main-wrapper {
		padding: var(--space-7);
		background-color: var(--clr-primary-badge);
		border-radius: var(--radius-5);
		text-decoration: none;
		color: var(--clr-font-text);

		h4 {
			font-size: var(--font-size-2);
			color: var(--clr-font-text);
		}
	}
</style>
