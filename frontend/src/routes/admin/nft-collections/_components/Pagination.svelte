<script lang="ts">
	import { Button } from '@emerald-dao/component-library';
	import Icon from '@iconify/svelte';

	export let amountOfItems: number;

	let pageSize = 6;

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

<div class="row-4">
	<Button
		on:click={prevPage}
		state={currentPage === 1 ? 'disabled' : 'active'}
		type="transparent"
		color="neutral"
	>
		<Icon icon="tabler:arrow-left" />
	</Button>
	<Button
		on:click={nextPage}
		state={pageEnd >= amountOfItems ? 'disabled' : 'active'}
		type="transparent"
		color="neutral"
	>
		<Icon icon="tabler:arrow-right" />
	</Button>
</div>
