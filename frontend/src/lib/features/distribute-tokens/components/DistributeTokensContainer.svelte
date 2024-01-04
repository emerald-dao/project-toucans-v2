<script>
	export let grid = true;
</script>

<div class:grid>
	<slot />
</div>

<style lang="scss">
	.grid {
		display: grid;
		grid-template-columns: 3fr 4fr;
		gap: var(--space-13);
		height: 100%;
		flex: 1;
	}

	div {
		display: flex;
		width: 100%;
	}
</style>
