<script type="ts">
	export let title: string;
	export let stepNumber: number;
</script>

<div class="main-wrapper">
	<span class="w-medium">
		<div class="number center">
			{stepNumber}
		</div>
		{title}
	</span>
	<slot />
</div>

<style type="scss">
	.main-wrapper {
		display: flex;
		flex-direction: column;
		gap: var(--space-2);
		border-bottom: 1px var(--clr-border-primary) solid;
		padding-bottom: var(--space-4);
		margin-bottom: var(--space-4);

		span {
			display: flex;
			flex-direction: row;
			gap: var(--space-2);
			align-items: center;
			color: var(--clr-heading-main);
			font-size: var(--font-size-4);
			font-family: var(--font-heading);

			.number {
				background-color: var(--clr-tertiary-badge);
				width: 32px;
				height: 32px;
				border-radius: 100%;
				color: var(--clr-tertiary-main);
				font-size: var(--font-size-2);
			}
		}
	}
</style>
