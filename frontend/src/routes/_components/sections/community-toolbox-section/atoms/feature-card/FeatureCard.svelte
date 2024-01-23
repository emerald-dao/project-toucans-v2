<div>
	<slot />
</div>

<style lang="scss">
	div {
		width: 100%;
		background: linear-gradient(
			180deg,
			var(--clr-background-primary) 0%,
			var(--clr-background-primary) 70%,
			rgba(255, 102, 196, 0.05) 100%
		);
		position: relative;
		border: 1px solid var(--clr-border-primary);
		border-radius: var(--radius-1);
		display: flex;
		flex-direction: column;
		gap: var(--space-5);
		align-items: flex-start;
		overflow: hidden;
	}
</style>
