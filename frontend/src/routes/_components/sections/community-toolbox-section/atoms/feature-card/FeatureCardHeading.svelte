<h3>
	<slot />
</h3>

<style lang="scss">
	h3 {
		font-size: 1.4rem;
		color: var(--clr-text-main);
		max-width: 30ch;

		@include mq('small') {
			font-size: 1.6rem;
		}
	}
</style>
