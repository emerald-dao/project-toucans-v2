<script lang="ts">
	import Icon from '@iconify/svelte';

	export let address: string;
</script>

<span class="xsmall wallet-label"><Icon icon="tabler:wallet" />{address}</span>

<style lang="scss">
	.wallet-label {
		border: 0.5px solid var(--clr-border-primary);
		padding: var(--space-1) var(--space-3);
		border-radius: 99px;
		display: flex;
		flex-direction: row;
		align-items: center;
		gap: var(--space-1);
		width: fit-content;
	}
</style>
