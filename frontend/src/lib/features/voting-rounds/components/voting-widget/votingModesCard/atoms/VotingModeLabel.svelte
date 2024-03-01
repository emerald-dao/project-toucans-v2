<div class="voting-mode-label">
	<slot />
</div>

<style lang="scss">
	.voting-mode-label {
		background-color: var(--clr-tertiary-badge);
		border: 1px solid var(--clr-tertiary-badge);
		color: var(--clr-tertiary-main);
		padding: 0 var(--space-2);
		font-size: var(--font-size-0);
		width: fit-content;
		border-radius: var(--radius-0);
		display: flex;
		flex-direction: row;
		align-items: center;
		gap: var(--space-1);
	}
</style>
