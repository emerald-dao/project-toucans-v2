<div class="column-5">
	<slot />
</div>

<style lang="scss">
	div {
		padding-inline: var(--space-8);
		padding-block: var(--space-8) var(--space-6);
		align-items: flex-start;
		font-size: var(--font-size-3);

		@include mq('small') {
			padding-inline: var(--space-12);
			padding-block: var(--space-12) var(--space-8);
		}
	}
</style>
