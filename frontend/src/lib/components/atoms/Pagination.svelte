<script lang="ts">
	import { Button } from '@emerald-dao/component-library';
	import Icon from '@iconify/svelte';

	export let amountOfItems: number;

	export let pageSize = 6;

	export let pageStart = 0;
	export let pageEnd = pageSize;

	let currentPage = 1;
	const nextPage = () => {
		currentPage += 1;
	};
	const prevPage = () => {
		currentPage -= 1;
	};

	$: pageStart = (currentPage - 1) * pageSize;
	$: pageEnd = pageStart + pageSize;
</script>

<div class="main-wrapper row-space-between row-4 align-center">
	<Button
		on:click={prevPage}
		state={currentPage === 1 ? 'disabled' : 'active'}
		type="transparent"
		color="neutral"
	>
		<Icon
			icon="tabler:arrow-left"
			color={currentPage === 1 ? 'var(--clr-text-main)' : 'var(--clr-heading-main)'}
		/>
	</Button>
	<p class="xsmall">
		{currentPage}
		<span class="off">
			/ {Math.ceil(amountOfItems / pageSize)}
		</span>
	</p>
	<Button
		on:click={nextPage}
		state={pageEnd >= amountOfItems ? 'disabled' : 'active'}
		type="transparent"
		color="neutral"
	>
		<Icon
			icon="tabler:arrow-right"
			color={pageEnd >= amountOfItems ? 'var(--clr-text-main)' : 'var(--clr-heading-main)'}
		/>
	</Button>
</div>

<style lang="scss">
	.main-wrapper {
		width: 100%;

		.off {
			color: var(--clr-text-off);
		}
	}
</style>
