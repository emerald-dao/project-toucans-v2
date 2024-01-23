<script lang="ts">
	import FlowLogo from './FlowLogo.svelte';
	import { onMount } from 'svelte';

	export let src: string;
	export let alt: string;

	export let width: string;
	export let height: string;

	export let objectFit = 'cover';

	let loaded = false;
	let failed = false;
	let loading = false;

	onMount(() => {
		const img = new Image();
		img.src = src;
		loading = true;

		img.onload = () => {
			loading = false;
			loaded = true;
		};
		img.onerror = () => {
			loading = false;
			failed = true;
		};
	});
</script>

{#if loaded}
	<img {src} {alt} {width} {height} style={`object-fit: ${objectFit}`} />
{:else if failed}
	<div style={`width: ${width}; height: ${height}`}>
		<FlowLogo />
	</div>
{:else if loading}
	<div class="loading" style={`width: ${width}; height: ${height}`} />
{/if}

<style lang="scss">
	div {
		background-color: var(--clr-background-secondary);
		display: flex;
		justify-content: center;
		align-items: center;
		padding: 30%;

		&.loading {
			background: var(--clr-bacgkround-primary);
			animation: brightness 2.5s ease infinite;

			@keyframes brightness {
				0% {
					background: var(--clr-background-primary);
				}
				50% {
					background: var(--clr-background-secondary);
				}
				100% {
					background: var(--clr-background-primary);
				}
			}
		}
	}
</style>
