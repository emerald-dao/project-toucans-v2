<script type="ts">
	import { Card } from '$components/atoms';
	import Icon from '@iconify/svelte';
	import { Row } from '@mateoroldos/svelte.bones';
	import { createEventDispatcher } from 'svelte';
	import { fly } from 'svelte/transition';

	const dispatch = createEventDispatcher();

	function deleteDist() {
		dispatch('deleteDist');
	}

	export let forAccount: string;
	export let amount: number | undefined;
	export let tokenName: string;
</script>

<div transition:fly|local={{ x: 10, duration: 700 }}>
	<Row gap="small">
		<Card padding={1.4} width="100%">
			<Row gap={1}>
				<span><span class="token-name">{`$${tokenName} `} </span>{amount}</span>
				<Icon icon="tabler:arrow-narrow-right" />
				<span>{forAccount}</span>
			</Row>
		</Card>
		<div class="clickable" on:click={deleteDist}>
			<Icon icon="tabler:circle-x" />
		</div>
	</Row>
</div>

<style type="scss">
	span {
		font-size: var(--fs-100);
		--font-weight: 500;
	}

	.token-name {
		color: var(--clr-font-text-t5);
	}

	.clickable {
		cursor: pointer;
	}
</style>
