<p><slot /></p>

<style lang="scss">
	p {
		font-size: var(--font-size-2);

		@include mq('small') {
			font-size: var(--font-size-3);
		}

		@include mq('medium') {
			font-size: var(--font-size-4);
		}
	}
</style>
