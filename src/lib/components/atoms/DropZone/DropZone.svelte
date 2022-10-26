<script type="ts">
	import DropZoneFile from './DropZoneFile.svelte';
	import Icon from '@iconify/svelte';
	import { getFilesAsync } from '$lib/utilities/getFilesAsync';

	let dragOver = false; // Flag to check if we are dragging over the dropzone
	let inputRef: HTMLInputElement; // Reference to the hidden input element

	export let name: string;
	export let placeholder = 'Drop file here or click to upload';
	export let accept: string; // Type of file we accept
	export let isDirectory: boolean = false;
	export let multiple: boolean = false;
	export let bindValue: File[];
	export let validationFunction: ((files: File[] | FileList) => Promise<true>) | null = null;

	let errors: string[] = [];

	const saveFile = async (files: File[] | FileList | null) => {
		if (files) {
			if (validationFunction) {
				validationFunction(files)
					.then(() => {
						bindValue = [...files];
						errors = [];
					})
					.catch((err) => {
						errors = err;
					});
			} else {
				bindValue = [...files];
				errors = [];
			}
		}
	};

	const deleteAllFiles = () => {
		bindValue = [];
	};

	const deleteFile = (i: number) => {
		bindValue.splice(i, 1);
		bindValue = bindValue;
	};

	const handleFileDrop = async (e: DragEvent) => {
		e.preventDefault();
		dragOver = false;
		if (e.dataTransfer?.items) {
			const getFiles = await getFilesAsync(e.dataTransfer?.items);
			saveFile(getFiles);
		}
	};

	const onInput = (e: Event) => {
		e.preventDefault();
		dragOver = false;
		saveFile((e.target as HTMLInputElement).files);
	};
</script>

<div
	class="drop-zone"
	class:drop-zone-over={dragOver}
	class:drop-zone-error={errors && errors.length > 0}
	on:dragover={() => (dragOver = true)}
	on:dragleave={() => (dragOver = false)}
	on:dragend={() => (dragOver = false)}
	on:drop={handleFileDrop}
	on:click={() => inputRef.click()}
	ondragover="return false"
>
	{#if bindValue && bindValue.length > 2}
		<div class="empty-all-wrapper">
			<div on:click|stopPropagation={deleteAllFiles} class="empty-all-icon-wrapper">
				<Icon icon="ion:trash" color="var(--clr-accent-main)" />
			</div>
		</div>
	{/if}

	{#if bindValue && bindValue.length > 0}
		{#each bindValue as file, index}
			<DropZoneFile {file} on:deleteFile={() => deleteFile(index)} />
		{/each}
	{:else}
		<Icon icon="ion:cloud-upload-outline" color="var(--clr-accent-main-t3)" />
		<span class="prompt">{placeholder}</span>
	{/if}
	{#if errors.length > 0}
		{#each errors as error}
			<p class="error">{error}</p>
		{/each}
	{/if}

	<!-- Add a hidden input element to trigger when the user clicks the drop zone -->
	{#if isDirectory}
		<input
			{name}
			id={name}
			type="file"
			{accept}
			bind:this={inputRef}
			on:input={onInput}
			{multiple}
			webkitdirectory
		/>
	{:else}
		<input
			{name}
			id={name}
			type="file"
			{accept}
			bind:this={inputRef}
			on:input={onInput}
			{multiple}
		/>
	{/if}
</div>

<style type="scss">
	.drop-zone {
		width: 100%;
		height: auto;
		max-height: 16rem;
		padding: 2rem;
		display: flex;
		flex-direction: column;
		gap: 1rem;
		align-items: center;
		justify-content: flex-start;
		text-align: center;
		cursor: pointer;
		color: var(--clr-font-text);
		border: 2px var(--clr-primary-main-t5) solid;
		background-color: var(--clr-primary-main-t9);
		border-radius: 10px;
		transition: 0.5s;
		overflow-y: auto;
		margin-top: 1rem;

		.prompt {
			font-size: var(--fs-300);
			color: var(--clr-primary-main-t3);
		}

		.empty-all-wrapper {
			width: 100%;
			position: sticky;
			top: -1rem;
			margin-top: -3.8rem;
			margin-right: -2rem;
			z-index: 100;
			display: flex;
			flex-direction: column;
			align-items: flex-end;

			.empty-all-icon-wrapper {
				background-color: var(--clr-primary-main-t8);
				padding: 0.4rem;
				border-radius: 0.4rem;
				display: flex;
				align-items: center;
				justify-content: center;
				border: 2px var(--clr-primary-main-t7) solid;
			}
		}
	}

	.drop-zone-over {
		background-color: var(--clr-primary-main-t6);
	}
	.drop-zone-error {
		border-color: red;
	}

	input {
		display: none;
	}
</style>
