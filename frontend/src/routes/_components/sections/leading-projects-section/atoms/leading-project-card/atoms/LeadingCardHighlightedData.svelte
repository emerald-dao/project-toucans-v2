<script lang="ts">
	import type { LeadingProjectType } from '../../../leadingProjects';

	export let data: string;
	export let description: string;
	export let type: LeadingProjectType;
</script>

<div class="main-wrapper row-1">
	<div class="w-medium label">
		{#if type === 'highTokenPrice'}
			$
		{/if}
		{data}
	</div>
	<span>{description}</span>
</div>

<style lang="scss">
	.main-wrapper {
		font-size: var(--font-size-0);
		align-items: center;
		margin-top: var(--space-4);

		.label {
			background-color: var(--clr-primary-badge);
			color: var(--clr-primary-main);
			font-size: var(--font-size-0);
			padding: 0 var(--space-3);
			border-radius: 10px;
		}
	}
</style>
