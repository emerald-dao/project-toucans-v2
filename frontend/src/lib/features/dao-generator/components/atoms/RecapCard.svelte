<script type="ts">
	import Icon from '@iconify/svelte';

	export let title: string;
	export let onEdit: (() => void) | undefined = undefined;
	export let onClean: (() => void) | undefined = undefined;
</script>

<div class="card-primary">
	<h4>{title}</h4>
	<div class="column-3 align-start">
		<slot />
	</div>
	<div class="edit-wrapper">
		{#if onEdit != undefined}
			<div class="header-link" on:click={() => onEdit()} on:keydown>
				<Icon icon="tabler:edit" />
			</div>
		{/if}
		{#if onClean != undefined}
			<div class="header-link" on:click={() => onClean()} on:keydown>
				<Icon icon="tabler:trash" />
			</div>
		{/if}
	</div>
</div>

<style type="scss">
	.card-primary {
		position: relative;
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: 1.8rem;
		width: 100%;

		h4 {
			font-size: var(--font-size-3);
		}

		.edit-wrapper {
			position: absolute;
			top: 25px;
			right: 25px;
			display: flex;
			flex-direction: row;
			gap: var(--space-2);
		}
	}
</style>
