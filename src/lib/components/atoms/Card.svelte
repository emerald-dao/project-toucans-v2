<script type="ts">
	export let padding: number = 5;
</script>

<div style={`padding: ${padding}rem`}>
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
