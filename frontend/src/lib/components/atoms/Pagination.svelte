<script lang="ts">
	import Icon from '@iconify/svelte';

	export let amountOfItems: number;

	export let pageSize = 6;

	export let pageStart = 0;
	export let pageEnd = pageSize;

	$: currentPage = Math.ceil(pageEnd / pageSize);

	const nextPage = () => {
		pageStart += pageSize;
		pageEnd += pageSize;
	};
	const prevPage = () => {
		pageStart -= pageSize;
		pageEnd -= pageSize;
	};

	$: if (amountOfItems <= pageStart) {
		prevPage();
		currentPage = Math.ceil(pageEnd / pageSize);
	}

	$: if (pageEnd === 0 && amountOfItems > 0) {
		pageStart = 0;
		pageEnd = pageSize;
	}

	$: if (pageEnd - pageSize > amountOfItems) {
		pageEnd = Math.ceil(amountOfItems / pageSize) * pageSize;
		pageStart = pageEnd - pageSize;
	}

	$: if (amountOfItems === 0) {
		pageStart = 0;
		pageEnd = pageSize;
	}
</script>

<div class="main-wrapper row-space-between row-4 align-center">
	<button
		on:click={prevPage}
		disabled={currentPage === 1 || currentPage === 0}
		type="button"
		color="neutral"
	>
		<Icon icon="tabler:arrow-left" />
	</button>
	<p class="xsmall">
		{currentPage}
		<span class="off">
			/ {Math.ceil(amountOfItems / pageSize)}
		</span>
	</p>
	<button on:click={nextPage} disabled={pageEnd >= amountOfItems} type="button" color="neutral">
		<Icon icon="tabler:arrow-right" />
	</button>
</div>

<style lang="scss">
	.main-wrapper {
		width: 100%;

		button {
			padding: 0;
			border: none;
			background: none;
			cursor: pointer;
			outline: none;
			color: var(--clr-heading-main);

			&:disabled {
				cursor: not-allowed;
				color: var(--clr-text-off);
			}
		}

		p {
			color: var(--clr-heading-main);

			.off {
				color: var(--clr-text-off);
			}
		}
	}
</style>
