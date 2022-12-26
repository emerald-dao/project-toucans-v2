<script type="ts">
	import Icon from '@iconify/svelte';
	import { Button, InputWrapper, Range } from '@emerald-dao/component-library';
	import DistributionElement from '../atoms/DistributionElement.svelte';
	import roundDistributionSuite from '$lib/validations/roundDistributionSuite';

	let distributionData: DistributionData = {
		address: '',
		percentage: 0
	};

	interface DistributionData {
		address: string;
		percentage: number;
	}

	const handleChange = () => {
		res = roundDistributionSuite(distributionData);
	};

	const handleSubmit = () => {
		distributionList = [...distributionList, distributionData];
		distributionData = {
			address: '',
			percentage: 0
		};
	};

	let res = roundDistributionSuite.get();

	let distributionList: DistributionData[] = [
		{
			address: 'Treasury Wallet',
			percentage: 100
		}
	];

	const onDistributionListChange = (newList: DistributionData[]) => {
		let distributedPercentage = 0;

		for (let index = 1; index < newList.length; index++) {
			distributedPercentage = distributedPercentage + newList[index].percentage;
		}

		distributionList[0].percentage = 100 - distributedPercentage;
	};

	$: {
		onDistributionListChange(distributionList);
	}
</script>

<div class="column-4">
	<span>Distribution</span>
	<div class="main-wrapper">
		<form>
			<InputWrapper
				name="address"
				label="Address"
				isValid={res.isValid('address')}
				errors={res.getErrors('address')}
			>
				<input
					type="text"
					id="address"
					bind:value={distributionData.address}
					on:input={handleChange}
				/>
			</InputWrapper>
			<label for="distribution-percentage">Distribution percentage</label>
			<Range
				bind:value={distributionData.percentage}
				max={distributionList[0].percentage}
				suffix="%"
				id="distribution-percentage"
				--clr-surface-secondary="var(--clr-surface-primary)"
			/>
			<Button size="full-width" type="ghost" color="neutral" on:click={handleSubmit}
				><Icon icon="tabler:plus" /> Add</Button
			>
		</form>
		<div class="column-4">
			{#each distributionList as distrbutionData, i}
				<DistributionElement
					address={distrbutionData.address}
					percentage={distrbutionData.percentage}
					{i}
				/>
			{/each}
			<div />
		</div>
	</div>
</div>

<style type="scss">
	.main-wrapper {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: var(--space-8);
	}

	span {
		color: var(--clr-heading-main);
	}
</style>
