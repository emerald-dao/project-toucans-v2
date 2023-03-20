<script lang="ts">
	import IconCircle from '$components/atoms/IconCircle.svelte';
</script>

<div>
	<div class="row-3 align-center">
		<IconCircle icon="tabler:check" color="primary" />
		<h3>Round created</h3>
	</div>
	<p>Your funding round has been deployed to the blockchain.</p>
</div>

<style lang="scss">
	h3 {
		font-size: var(--font-size-6);
		margin-bottom: var(--space-2);
	}
</style>
