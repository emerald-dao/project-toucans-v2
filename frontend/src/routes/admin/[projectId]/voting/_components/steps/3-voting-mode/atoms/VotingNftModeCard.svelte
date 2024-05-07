<script lang="ts">
	export let title: string;
	export let description: string;
	export let slug: string;
	export let selectedSlug: string;
</script>

<div
	class="card column-2"
	on:click={() => (selectedSlug = slug)}
	class:active={selectedSlug === slug}
>
	<h4>
		{title}
	</h4>
	<p class="small">{description}</p>
</div>

<style lang="scss">
	.card {
		padding: var(--space-6);
		border-radius: var(--radius-3);
		border: 1px solid var(--clr-border-primary);
		cursor: pointer;
		transition: all 0.2s ease-in-out;

		&.active {
			border-color: var(--clr-primary-main);
			background-color: var(--clr-surface-primary);
		}

		h4 {
			font-size: var(--font-size-2);
		}
	}
</style>
