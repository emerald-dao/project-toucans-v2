<script lang="ts">
	export let title: string;
	export let stat: string | number;
</script>

<div class="main-wrapper column">
	<span class="xsmall">{title} </span>
	<span class="stat">{stat}</span>
</div>

<style lang="scss">
	.main-wrapper {
		margin-top: var(--space-2);

		.stat {
			color: var(--clr-heading-main);
			font-size: var(--font-size-3);
		}
	}
</style>
