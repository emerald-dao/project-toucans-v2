<script>
	export let hasPadding = false;
</script>

<div class:padding={hasPadding} class="column align-center">
	<slot />
</div>

<style lang="scss">
	div {
		width: 100%;
		padding-inline: var(--space-12);
		margin-bottom: -3.2rem;
		display: grid;
	}
</style>
