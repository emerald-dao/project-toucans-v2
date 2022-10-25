<script type="ts">
	import { Card } from '$components/atoms';
	import Icon from '@iconify/svelte';
	import { Row } from '@mateoroldos/svelte.bones';
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();

	function deleteDist() {
		dispatch('deleteDist');
	}

	export let forAccount: string;
	export let amount: number;
</script>

<Row gap="small">
	<Card padding={1.4} width="100%">
		<Row gap={1}>
			<span>{amount}</span>
			<Icon icon="tabler:arrow-narrow-right" />
			<span>{forAccount}</span>
		</Row>
	</Card>
	<div class="clickable" on:click={deleteDist}>
		<Icon icon="tabler:playstation-x" />
	</div>
</Row>

<style type="scss">
	span {
		font-size: var(--fs-200);
	}

	.clickable {
		cursor: pointer;
	}
</style>
