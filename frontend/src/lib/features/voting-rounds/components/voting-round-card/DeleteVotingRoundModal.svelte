<script lang="ts">
	import { fly } from 'svelte/transition';
	import { user } from '$stores/flow/FlowStore';
	import { Button, Modal, getModal } from '@emerald-dao/component-library';
	import Icon from '@iconify/svelte';
	import { enhance } from '$app/forms';

	export let votingRoundId: number;
	export let projectId: string;
	export let daoSigners: string[];

	let modalId = `delete-voting-round-${votingRoundId}`;

	let isDeleting = false;
	let errorMessage: string;
</script>

{#if $user.addr && daoSigners.includes($user.addr)}
	<button on:click|preventDefault={() => getModal(modalId).open()}>
		<Icon icon="tabler:trash" />
	</button>
	<button on:click|preventDefault={() => getModal(modalId).open()}>
		<Icon icon="tabler:trash" />
	</button>
	<Modal id={modalId}>
		<div class="column-5">
			<p>Are you sure you wan't to delete this voting round?</p>

			{#if errorMessage}
				<p class="error row-1 align-center" in:fly={{ duration: 200, y: 20 }}>
					<Icon icon="tabler:alert-circle" inline />
					{errorMessage}
				</p>
			{/if}

			<div class="row-3 justify-end">
				<Button
					type="ghost"
					color="neutral"
					size="small"
					width="extended"
					on:click={() => getModal(modalId).close()}
					state={isDeleting ? 'disabled' : 'active'}
				>
					Cancel
				</Button>

				<form
					method="POST"
					action={`/admin/${projectId}/voting?/deleteVotingRound`}
					use:enhance={() => {
						isDeleting = true;

						return async ({ result, update }) => {
							if (result.type === 'success') {
								await update();
								isDeleting = false;
								getModal(modalId).close();
							}

							if (result.type === 'failure') {
								if (typeof result.data?.error === 'string') {
									errorMessage = result.data.error;
								} else {
									errorMessage = 'An error occurred';
								}

								isDeleting = false;
							}
						};
					}}
				>
					<input type="hidden" name="user" value={JSON.stringify($user)} />
					<input type="hidden" name="voting-round-id" value={votingRoundId} />
					<input type="hidden" name="dao-signers" value={JSON.stringify(daoSigners)} />

					<Button
						color="neutral"
						size="small"
						width="extended"
						state={isDeleting ? 'loading' : 'active'}
					>
						{#if isDeleting}
							Deleting
						{:else}
							Delete
						{/if}
					</Button>
				</form>
			</div>
		</div>
	</Modal>
{/if}

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

	.error {
		color: var(--clr-alert-main);
		font-size: var(--font-size-1);
	}
</style>
