<div>
	<slot />
</div>

<style lang="scss">
	div {
		border-radius: 0.8rem;
		border: 1px solid var(--clr-border-primary);
		display: flex;
		padding: var(--space-1) var(--space-2);
		align-items: center;
		justify-content: center;
		gap: var(--space-3);
	}
</style>
