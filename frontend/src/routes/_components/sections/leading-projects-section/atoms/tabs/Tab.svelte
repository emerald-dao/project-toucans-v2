<script lang="ts">
	export let value: string;
	export let selectedTab: string;

	const handleSelectedTab = () => {
		selectedTab = value;
	};
</script>

<div class:selected={selectedTab === value} class="w-medium" on:click={handleSelectedTab}>
	<slot />
</div>

<style lang="scss">
	div {
		cursor: pointer;
		padding: var(--space-1) var(--space-5);
		transition: all 0.2s ease-in-out;
		border-radius: 0.5rem;
		border: 1px solid transparent;
		font-size: var(--font-size-1);

		&:hover {
			background-color: var(--clr-surface-primary);
		}

		&.selected {
			color: var(--clr-heading-main);
			background-color: var(--clr-neutral-badge);

			&:hover {
				background-color: var(--clr-neutral-badge);
			}
		}
	}
</style>
