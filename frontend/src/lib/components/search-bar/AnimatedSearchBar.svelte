<script type="ts">
	import { fly } from 'svelte/transition';
	import IconCircle from '$components/atoms/IconCircle.svelte';
	import { onDestroy } from 'svelte';
	import { createSearchStore, searchHandler } from './searchStore';

	export let items: any[];
	export let searchTerms: string[];
	export let filteredItems;
	export let placeholder = 'Search';

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
		if ($searchStore.search === '') {
			viewSpecialMessage = false;
		}
	};

	$: searchStore = createSearchStore(searchItem);

	$: filteredItems = $searchStore.filtered;

	const resolveSearchTerm = (item: any) => {
		let resolvedSearchTerms = searchTerms.map((term) => item[term]);
		return resolvedSearchTerms.join(' ').toLowerCase();
	};

	$: searchItem = items.map((item) => ({
		...item,
		searchTerms: resolveSearchTerm(item)
	}));

	$: unsubscribe = searchStore.subscribe((model) => searchHandler(model));

	onDestroy(() => {
		unsubscribe();
	});
</script>

<div class="main-wrapper row-1 align-center">
	{#if !viewSpecialMessage}
		<button on:click|preventDefault={onToggleSpecialMessage} class="row-2">
			<div in:fly|local={{ duration: 200, x: -10 }}>
				<IconCircle icon="tabler:search" color="neutral" />
			</div>
			{placeholder}
		</button>
	{/if}
	{#if viewSpecialMessage}
		<div class="message-wrapper" in:fly|local={{ x: 20, duration: 200 }}>
			<input
				type="text"
				name="message"
				id="special-message"
				maxlength="70"
				on:focusout={inputFocusOut}
				{placeholder}
				bind:this={specialMessageInput}
				bind:value={$searchStore.search}
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
