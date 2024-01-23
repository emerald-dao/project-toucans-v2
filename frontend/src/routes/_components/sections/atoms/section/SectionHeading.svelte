<h2 class="w-medium"><slot /></h2>

<style lang="scss">
	h2 {
		text-align: center;
		font-size: var(--font-size-6);

		@include mq('small') {
			font-size: var(--font-size-7);
		}

		@include mq('medium') {
			font-size: var(--font-size-9);
		}
	}
</style>
