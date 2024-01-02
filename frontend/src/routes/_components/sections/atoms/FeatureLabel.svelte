<script lang="ts">
	import Icon from '@iconify/svelte';

	export let icon: string;
</script>

<div class="main-wrapper">
	<div class="icon">
		<Icon {icon} color="var(--clr-heading-inverse)" width="100%" />
	</div>
	<span>
		<slot />
	</span>
</div>

<style lang="scss">
	.main-wrapper {
		display: inline-flex;
		height: fit-content;
		align-items: center;
		gap: 0.5em;
		font-family: var(--font-mono);
		color: var(--clr-heading-main);
		font-size: 0.64em;
		border: 1px solid var(--clr-border-primary);
		border-radius: 6px;
		text-transform: uppercase;
		letter-spacing: 0.1em;
		white-space: nowrap;
		margin-inline: 0.2em;
		padding-block: 0.25em;
		padding-left: 0.24em;
		padding-right: 0.5em;

		span {
			line-height: 1;
		}

		.icon {
			display: inline-flex;
			background-color: var(--clr-tertiary-main);
			border-radius: 4px;
			align-items: center;
			justify-content: center;
			height: 1.8em;
			width: 1.8em;
			padding: 0.4em;
		}
	}
</style>
