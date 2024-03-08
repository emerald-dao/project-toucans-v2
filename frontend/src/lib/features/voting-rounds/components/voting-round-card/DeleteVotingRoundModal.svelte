<script lang="ts">
	import { Button, Modal, getModal } from '@emerald-dao/component-library';
	import Icon from '@iconify/svelte';

	export let id = 'aa';
</script>

<button on:click|preventDefault={() => getModal(id).open()}> <Icon icon="tabler:trash" /> </button>
<Modal {id}>
	<div class="column-5">
		<p>Are you sure you wan't to delete this voting round?</p>
		<div class="row-3 justify-end">
			<Button
				type="ghost"
				color="neutral"
				size="small"
				width="extended"
				on:click={() => getModal(id).close()}
			>
				Cancel
			</Button>
			<Button color="neutral" size="small" width="extended" on:click={() => getModal(id).close()}
				>Delete</Button
			>
		</div>
	</div>
</Modal>

<style lang="scss">
	button {
		background-color: transparent;
		border: none;
		cursor: pointer;
		color: var(--clr-alert-main);
		transition: color 0.3s ease-in-out;
		position: absolute;
		right: 10px;
		top: 10px;
		z-index: 1;

		&:hover {
			color: var(--clr-alert-100);
		}
	}
</style>
