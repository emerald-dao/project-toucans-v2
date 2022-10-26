<script type="ts">
	import Icon from '@iconify/svelte';
	import { onMount } from 'svelte';
	import { createEventDispatcher } from 'svelte';

	onMount(() => {
		if (file?.type && file?.type.startsWith('image/')) {
			displayThumbnail(file);
		}
	});

	const displayThumbnail = (file: File) => {
		const reader = new FileReader();
		reader.readAsDataURL(file); // base 64 format

		reader.onload = () => {
			thumbnailElement.style.backgroundImage = `url('${reader.result}')`; /*asynchronous call. This function runs once reader is done reading file. reader.result is the base 64 format*/
			thumbnailElement.style.height = '100%';
			thumbnailElement.style.width = '60px';
			thumbnailElement.style.aspectRatio = '1/1';
			thumbnailElement.style.backgroundSize = 'contain';
			thumbnailElement.style.backgroundRepeat = 'no-repeat';
			thumbnailElement.style.backgroundPosition = 'center';
			thumbnailElement.style.display = 'flex';
			thumbnailElement.style.borderRadius = '0.2rem';
		};
	};

	let dispatch = createEventDispatcher();

	let thumbnailElement: HTMLDivElement;
	export let file: File;
</script>

<div class="drop-zone-file">
	<div class="file-data">
		{#if file.type && file.type.startsWith('image/')}
			<div bind:this={thumbnailElement} class="thumbnailElement" />
		{/if}
		<h5>{file.name}</h5>
	</div>
	<div on:click|stopPropagation={() => dispatch('deleteFile')}>
		<Icon icon="tabler:circle-x" color="var(--clr-accent-main)" />
	</div>
</div>

<style type="scss">
	@use '../../../styles/utils' as *;

	.drop-zone-file {
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		align-items: center;
		padding: 0.7rem 1.4rem;
		height: 5rem;
		min-height: 5rem;
		width: 100%;
		border-radius: 0.6rem;
		background-color: var(--clr-neutral-400-t7);
		font-size: var(--fs-200);
		position: relative;

		@include mq(small) {
			flex-direction: row;
		}

		h5 {
			color: var(--clr-font-heading);
			text-align: left;
		}

		.file-data {
			display: flex;
			flex-direction: row;
			align-items: flex-start;
			gap: 2rem;
			width: 100%;

			.thumbnailElement {
				display: none;
			}
		}
	}
</style>
