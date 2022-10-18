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
		border-radius: 1.4rem;
		width: fit-content;
		height: fit-content;
	}
</style>
