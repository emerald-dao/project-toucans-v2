<script lang="ts">
	import Icon from '@iconify/svelte';

	export let icon: string;
	export let textColor: 'heading' | 'text' = 'heading';
</script>

<div class="main-wrapper">
	<div class="icon">
		<Icon {icon} color="var(--clr-tertiary-main)" width="100%" />
	</div>
	<span class="w-medium" style={`color: var(--clr-${textColor}-main)`}>
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
		font-size: 0.7em;
		border-radius: 6px;
		text-transform: uppercase;
		letter-spacing: 0.1em;
		white-space: nowrap;
		margin-inline: 0.2em;
		padding-block: 0.25em;

		span {
			line-height: 0;
		}

		.icon {
			display: inline-flex;
			border-radius: 1.5px;
			align-items: center;
			justify-content: center;
			height: 1.8em;
			width: 1.8em;
			padding: 0.4em;
			border: 1px solid var(--clr-border-primary);
		}
	}
</style>
