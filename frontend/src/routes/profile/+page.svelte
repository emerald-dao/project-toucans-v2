<script lang="ts">
	import { enhance } from '$app/forms';
	import ConnectPage from '$components/atoms/ConnectPage.svelte';
	import { user } from '$stores/flow/FlowStore';
	import { Button, DropZone } from '@emerald-dao/component-library';

	let isUploading = false;
	let errorMessage = '';

	let image: File[] = [];
</script>

{#if !$user.addr}
	<ConnectPage />
{:else}
	<section class="container-small column-6">
		<h1>Profile</h1>
		<form
			method="POST"
			class="column-4"
			use:enhance={() => {
				isUploading = true;

				return async ({ result, update }) => {
					if (result.type === 'success') {
						await update();
						isUploading = false;
					}

					if (result.type === 'failure') {
						if (typeof result.data?.error === 'string') {
							errorMessage = result.data.error;
						} else {
							errorMessage = 'An error occurred';
						}

						isUploading = false;
					}
				};
			}}
		>
			<input type="hidden" name="user" value={JSON.stringify($user)} />
			<div class="column-1">
				<label for="user-name">Username</label>
				<input type="text" name="user-name" id="user-name" />
			</div>
			<DropZone
				name="user-avatar"
				maxAmountOfFiles={1}
				bind:bindValue={image}
				accept={['image/png']}
			/>

			{#if errorMessage}
				<p class="error">{errorMessage}</p>
			{/if}

			<Button
				color="neutral"
				size="small"
				width="extended"
				state={isUploading ? 'loading' : 'active'}
			>
				{#if isUploading}
					Uploading
				{:else}
					Upload
				{/if}
			</Button>
		</form>
	</section>
{/if}

<style lang="scss">
	h1 {
		font-size: var(--font-size-6);
	}

	.error {
		color: var(--clr-alert-main);
	}
</style>
