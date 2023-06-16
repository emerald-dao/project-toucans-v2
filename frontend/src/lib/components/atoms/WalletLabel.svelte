<script lang="ts">
	import Icon from '@iconify/svelte';

	export let address: string;
	export let find: string | undefined = undefined;
</script>

<a href={`/user/${address}`} class="header-link">
	<Icon icon="tabler:wallet" />{find ? find : address}
</a>

<style lang="scss">
	a {
		border: 0.5px solid var(--clr-border-primary);
		padding: 1px var(--space-3);
		border-radius: 99px;
		display: flex;
		flex-direction: row;
		align-items: center;
		gap: var(--space-1);
		width: fit-content;
		font-size: var(--font-size-0);
	}
</style>
