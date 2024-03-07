<script lang="ts">
	export let number: number;
</script>

<span class="xsmall">{`Option #${number}`}</span>

<style lang="scss">
	span {
		background-color: var(--clr-surface-secondary);
		padding: var(--space-1) var(--space-2);
		border-radius: var(--radius-1);
		width: fit-content;
		border: 1px solid var(--clr-border-primary);
		white-space: nowrap;
		height: fit-content;
	}
</style>
