<script lang="ts">
	import Icon from '@iconify/svelte';
	import type { LeadingProjectType } from '../../../leadingProjects';

	export let data: string;
	export let description: string;
	export let type: LeadingProjectType;
</script>

<div class="main-wrapper column-1">
	<span class="description row">
		<Icon icon="fluent:fire-24-filled" class="icon" color="var(--clr-primary-main)" width="1.2em" />
		{description}
	</span>
	<span class="data">
		{#if type === 'totalFunding'}
			$
		{/if}
		{data}
	</span>
</div>

<style lang="scss">
	.main-wrapper {
		font-size: var(--font-size-0);
		align-items: flex-start;

		.description {
			font-size: var(--font-size-0);
			gap: 0.1em;
			align-items: center;
			line-height: 1;
		}

		.data {
			font-size: var(--font-size-4);
			color: var(--clr-heading-main);
		}
	}
</style>
