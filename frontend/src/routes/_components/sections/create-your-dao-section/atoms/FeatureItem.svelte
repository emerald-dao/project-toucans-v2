<script lang="ts">
	import Icon from '@iconify/svelte';
</script>

<li>
	<div class="icon-wrapper">
		<Icon icon="tabler:check" color="var(--clr-primary-main)" width="0.9em" />
	</div>
	<span><slot /></span>
</li>

<style lang="scss">
	li {
		display: flex;
		align-items: center;
		gap: var(--space-2);
		font-size: var(--font-size-2);

		.icon-wrapper {
			background-color: var(--clr-primary-badge);
			border-radius: 999px;
			height: 1.4em;
			width: 1.4em;
			display: flex;
			align-items: center;
			justify-content: center;
		}
	}
</style>
