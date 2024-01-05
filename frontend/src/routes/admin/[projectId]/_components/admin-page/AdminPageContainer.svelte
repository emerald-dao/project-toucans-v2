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
	}

	div {
		display: flex;
		flex: 1;
		flex-direction: column;
		width: 100%;
	}
</style>
