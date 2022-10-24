<script type="ts">
	export let padding: number = 5;
	export let width: 'fit-content' | '100%' = 'fit-content';
</script>

<div style={`padding: ${padding}rem; width: ${width}`}>
	<slot />
</div>

<style type="scss">
	div {
		background-color: var(--clr-background-secondary);
		border: 1px var(--clr-neutral-900-t9) solid;
		border-radius: 1.4rem;
		height: fit-content;
	}
</style>
