<span><slot /></span>

<style lang="scss">
	span {
		@include mq('small') {
			display: block;
			white-space: nowrap;
			background: -webkit-linear-gradient(var(--clr-border-secondary), var(--clr-heading-main));
			-webkit-background-clip: text;
			-webkit-text-fill-color: transparent;
		}
	}
</style>
