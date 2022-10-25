<script type="ts">
	import distributionSuite from '$lib/validations/distributionSuite';
	import { Button } from '@emerald-dao/component-library';
	import Icon from '@iconify/svelte';
	import { Column } from '@mateoroldos/svelte.bones';
	import DistStagingElement from './components/DistStagingElement.svelte';

	interface Dist {
		forAccount: string;
		amount: number;
	}

	const handleChange = (input: Event) => {
		res = distributionSuite(currentDist, input.target.name);
	};

	let res = distributionSuite.get();

	let distStaging: Dist[] = [];

	let currentDist: Dist = {
		forAccount: '',
		amount: 0
	};

	const addToStaging = () => {
		distStaging = [...distStaging, { ...currentDist }];
	};

	const deleteFromStaging = (i: number) => {
		distStaging.splice(i, 1);
		distStaging = distStaging;
	};
</script>

<div class="main-wrapper">
	<div class="forms-wrapper sub-wrapper">
		<h4>Manual Add</h4>
		<form id="dist-form" on:submit|preventDefault={addToStaging}>
			<label for="address">Address</label>
			<input
				type="text"
				name="address"
				bind:value={currentDist.forAccount}
				on:input={handleChange}
			/>
			<label for="Amount">Amount</label>
			<input type="number" name="amount" bind:value={currentDist.amount} on:input={handleChange} />
		</form>
		<Button form="dist-form">Add <Icon icon="tabler:arrow-narrow-right" /></Button>
		<h4>Drop CSV</h4>
	</div>
	<div class="distribute-wrapper sub-wrapper">
		<Column gap="small">
			{#each distStaging as dist, i}
				<DistStagingElement
					forAccount={dist.forAccount}
					amount={dist.amount}
					on:deleteDist={() => deleteFromStaging(i)}
				/>
			{/each}
		</Column>
	</div>
</div>

<style type="scss">
	.main-wrapper {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 2rem;
		height: 100%;

		.sub-wrapper {
			background-color: var(--clr-background-secondary);
			padding: 2rem;
		}
	}
</style>
