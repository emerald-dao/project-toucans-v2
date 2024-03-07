<script type="ts">
	import { fly } from 'svelte/transition';
	import { paymentData } from '$lib/features/payments/stores/PaymentData';
	import IconCircle from '$components/atoms/IconCircle.svelte';

	export let message: string;
	export let messageText: string = 'Add a special message';
	let viewSpecialMessage = false;
	let specialMessageInput: HTMLInputElement;

	const onToggleSpecialMessage = () => {
		viewSpecialMessage = !viewSpecialMessage;

		if (viewSpecialMessage) {
			setTimeout(() => {
				specialMessageInput.focus();
			}, 200);
		}
	};

	const inputFocusOut = () => {
		if (message === '') {
			viewSpecialMessage = false;
		}
	};
</script>

<div class="main-wrapper row-1 align-center">
	{#if !viewSpecialMessage}
		<button on:click|preventDefault={onToggleSpecialMessage} class="row-2">
			<div in:fly|local={{ duration: 200, x: -10 }}>
				<IconCircle icon="tabler:plus" color="neutral" />
			</div>
			{messageText}
		</button>
	{/if}
	{#if viewSpecialMessage}
		<div class="message-wrapper" in:fly|local={{ x: 20, duration: 200 }}>
			<input
				name="message"
				placeholder={messageText}
				id="special-message"
				maxLength="70"
				bind:value={message}
				bind:this={specialMessageInput}
				on:focusout={inputFocusOut}
			/>
		</div>
	{/if}
</div>

<style lang="scss">
	.main-wrapper {
		min-height: 30px;

		button {
			background: none;
			border: none;
			color: var(--clr-font-text);
			font-size: var(--font-size-0);
			gap: var(--space-2);
			display: flex;
			flex-direction: row;
			align-items: center;
			cursor: pointer;

			&:hover {
				color: var(--clr-heading-main);
			}
		}

		.message-wrapper {
			width: 100%;

			input[name='message'] {
				border: none;
				width: 100%;
				font-size: var(--font-size-0);
				color: var(--clr-heading-main);
				padding: 0;
				border-radius: 0;
			}
		}
	}
</style>
