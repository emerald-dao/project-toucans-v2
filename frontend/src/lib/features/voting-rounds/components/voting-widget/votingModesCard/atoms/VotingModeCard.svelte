<div class="voting-mode-card">
	<slot />
</div>

<style lang="scss">
	.voting-mode-card {
		display: grid;
		grid-auto-columns: 1fr;
		grid-auto-flow: column;
		gap: var(--space-2);
		background-color: var(--clr-surface-primary);
		border: 1px solid var(--clr-border-primary);
		border-radius: var(--radius-1);
		overflow: hidden;
	}
</style>
