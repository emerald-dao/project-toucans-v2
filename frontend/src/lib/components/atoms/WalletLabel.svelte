<script lang="ts">
	import Icon from '@iconify/svelte';

	export let address: string;
	export let find: string | undefined = undefined;
	export let withBorder = true;
	export let color = 'var(--clr-text-main)';
	export let fontSize = 'var(--font-size-0)';
</script>

<a
	href={`/u/${address}`}
	class="header-link"
	class:withBorder
	style={`color: ${color}; font-size: ${fontSize}`}
>
	<Icon icon="tabler:wallet" />{find ? find : address}
</a>

<style lang="scss">
	a {
		display: flex;
		flex-direction: row;
		align-items: center;
		gap: var(--space-1);
		width: fit-content;
		line-height: 1;
	}

	a:hover {
		color: var(--clr-heading-main);
	}

	.withBorder {
		border: 0.5px solid var(--clr-border-primary);
		padding: 6px var(--space-3);
		border-radius: 99px;
	}
</style>
