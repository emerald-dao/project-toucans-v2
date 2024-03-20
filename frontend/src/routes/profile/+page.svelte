<script lang="ts">
	import Icon from '@iconify/svelte';
	import { enhance } from '$app/forms';
	import ConnectPage from '$components/atoms/ConnectPage.svelte';
	import { profile, user } from '$stores/flow/FlowStore';
	import { Button, DropZone } from '@emerald-dao/component-library';

	let isUploading = false;
	let errorMessage = '';

	let image: File[] = [];

	let profileName: string;
	let profileAvatar: string;
	let useFind: boolean;
</script>

{#if !$user.addr}
	<ConnectPage />
{:else}
	<section class="container-small column-6">
		<div class="card column-10">
			<div class="card-header">
				<h1>Edit profile</h1>
				<span class="wallet-address">
					<Icon icon="tabler:wallet" inline />
					{$user.addr}
				</span>
				<div class="image-wrapper">
					<img src={$profile?.avatar} alt="User avatar" />
					<button>
						<Icon icon="tabler:edit" inline width="14px" />
					</button>
				</div>
			</div>
			<form
				method="POST"
				class="column-5"
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

				<label for="use-find" class="switch">
					<input type="checkbox" name="use-find" id="use-find" bind:checked={useFind} />
					<span class="slider" />
					Use .find profile
				</label>

				<div class="column-1">
					<label for="user-name">Username</label>
					<input type="text" name="user-name" id="user-name" />
				</div>

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
		</div>
	</section>
{/if}

<style lang="scss">
	section {
		display: flex;
		align-items: center;

		.card {
			background-color: var(--clr-surface-primary);
			max-width: 350px;
			width: 100%;
			display: flex;
			flex-direction: column;

			.card-header {
				display: flex;
				flex-direction: column;
				align-items: center;
				gap: var(--space-3);

				h1 {
					font-size: var(--font-size-4);
					margin-bottom: var(--space-2);
				}

				.wallet-address {
					background-color: var(--clr-background-secondary);
					padding: var(--space-1) var(--space-3);
					border-radius: var(--radius-1);
					border: 1px solid var(--clr-border-primary);
					width: fit-content;
					font-size: var(--font-size-1);
				}

				.image-wrapper {
					position: relative;

					img {
						max-width: 120px;
						border-radius: var(--radius-2);
						border: 1px solid var(--clr-border-primary);
					}

					button {
						position: absolute;
						bottom: -4px;
						right: -6px;
						background-color: var(--clr-primary-main);
						border: none;
						border-radius: 50%;
						padding: var(--space-1);
						cursor: pointer;
						width: 26px;
						height: 26px;
						display: flex;
						justify-content: center;
						align-items: center;
					}
				}
			}

			form {
			}

			.error {
				color: var(--clr-alert-main);
			}
		}
	}
</style>
