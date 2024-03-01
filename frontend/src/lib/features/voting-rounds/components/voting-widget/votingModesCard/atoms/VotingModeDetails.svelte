<div>
	<slot />
</div>

<style lang="scss">
	div {
		padding: var(--space-4);
		display: flex;
		flex-direction: column;
		gap: var(--space-2);
		background-color: var(--clr-surface-secondary);
		border-left: 0.5px solid var(--clr-border-primary);
	}
</style>
