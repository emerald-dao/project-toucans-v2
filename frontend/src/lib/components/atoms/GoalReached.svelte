<script>
	import IconCircle from './IconCircle.svelte';
</script>

<span class="xsmall goal-reached row-1 align-center">
	<IconCircle icon="tabler:trophy" color="primary" />
	Goal reached
</span>

<style lang="scss">
	.goal-reached {
		margin-left: var(--space-3);
		color: var(--clr-primary-main);
	}
</style>
