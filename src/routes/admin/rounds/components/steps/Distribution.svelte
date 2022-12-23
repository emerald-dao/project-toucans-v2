<script type="ts">
	import Icon from '@iconify/svelte';
	import { Button, InputWrapper } from '@emerald-dao/component-library';
	import DistributionElement from '../atoms/DistributionElement.svelte';

	let distributionData: DistributionData = {
		address: '',
		percentage: null
	};

	interface DistributionData {
		address: string;
		percentage: number | null;
	}

	const handleSubmit = () => {
		distributionList = [...distributionList, distributionData];
		distributionData = {
			address: '',
			percentage: null
		};
	};

	let distributionList: DistributionData[] = [];
</script>

<div class="column-4">
	<span>Distribution</span>
	<div class="main-wrapper">
		<form>
			<InputWrapper name="address" isValid={true} errors={[]} label="Address">
				<input type="text" id="address" bind:value={distributionData.address} />
			</InputWrapper>
			<InputWrapper name="percentage" isValid={true} errors={[]} label="Percentage">
				<input type="number" id="percentage" bind:value={distributionData.percentage} />
			</InputWrapper>
			<Button size="full-width" type="ghost" color="neutral" on:click={handleSubmit}
				><Icon icon="tabler:plus" /> Add</Button
			>
		</form>
		<div class="column-4">
			{#each distributionList as distrbutionData, i}
				<DistributionElement address={distrbutionData.address} {i} />
			{/each}
			<div />
		</div>
	</div>
</div>

<style>
	.main-wrapper {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: var(--space-8);
	}

	span {
		color: var(--clr-heading-main);
	}
</style>
