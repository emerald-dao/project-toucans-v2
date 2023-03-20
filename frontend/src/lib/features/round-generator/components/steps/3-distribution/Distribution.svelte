<script type="ts">
	import { fade } from 'svelte/transition';
	import Icon from '@iconify/svelte';
	import { Button, InputWrapper, Range } from '@emerald-dao/component-library';
	import validationSuite from './validation';
	import PieChart from '$components/charts/PieChart.svelte';
	import type { SvelteComponent } from 'svelte';
	import StepTitle from '../../../components/atoms/StepTitle.svelte';
	import { roundGeneratorData } from '../../../stores/RoundGeneratorData';
	import { newRoundActiveStep } from '../../../stores/RoundGeneratorSteps';

	let distributionData: [string, number] = ['', 0];

	let distributionAddresses: string[] = $roundGeneratorData.distributionList.map((x) => x[0]);
	let distributionPercentages: number[] = $roundGeneratorData.distributionList.map((x) => x[1]);

	let chart: SvelteComponent;

	const handleChange = (input: Event) => {
		if (input.type === 'change') {
			res = validationSuite(distributionData, 'percentage');
		} else {
			const target = input.target as HTMLInputElement;
			res = validationSuite(distributionData, target.name);
		}
	};

	let res = validationSuite.get();

	const handleSubmit = () => {
		validationSuite.reset();
		res = validationSuite.get();

		chart.updateChartData(distributionData[0], distributionData[1]);

		$roundGeneratorData.distributionList = [
			...$roundGeneratorData.distributionList,
			distributionData
		];
		distributionData = ['', 0];
	};

	const deleteFromDistributionList = (i: number) => {
		$roundGeneratorData.distributionList.splice(i, 1);
		$roundGeneratorData.distributionList = $roundGeneratorData.distributionList;
	};

	const onDistributionListChange = (newList: [string, number][]) => {
		let distributedPercentage = 0;

		for (let index = 1; index < newList.length; index++) {
			distributedPercentage = distributedPercentage + newList[index][1];
		}

		$roundGeneratorData.distributionList[0][1] = 100 - distributedPercentage;
	};

	$: {
		onDistributionListChange($roundGeneratorData.distributionList);
	}
</script>

<div class="main-wrapper" in:fade={{ duration: 300 }}>
	<div class="left-wrapper">
		<form class="card-primary">
			<InputWrapper
				name="address"
				label="Address"
				isValid={res.isValid('address')}
				errors={res.getErrors('address')}
			>
				<input
					type="text"
					id="address"
					maxlength="18"
					bind:value={distributionData[0]}
					on:input={handleChange}
				/>
			</InputWrapper>
			<div class="range-wrapper">
				<label for="distribution-percentage">Percentage to distribute</label>
				<Range
					bind:value={distributionData[1]}
					max={$roundGeneratorData.distributionList[0][1]}
					suffix="%"
					id="distribution-percentage"
					on:change={handleChange}
				/>
			</div>
			<Button
				width="full-width"
				type="ghost"
				color="neutral"
				on:click={handleSubmit}
				state={res.isValid() ? 'active' : 'disabled'}><Icon icon="tabler:plus" /> Add</Button
			>
		</form>
	</div>
	<div class="right-wrapper">
		<PieChart
			title="distribution"
			chartData={distributionPercentages}
			labels={distributionAddresses}
			bind:this={chart}
		/>
		<div />
	</div>
</div>

<style type="scss">
	.main-wrapper {
		display: grid;
		grid-template-columns: 4fr 3fr;
		gap: var(--space-10);

		.left-wrapper {
			display: flex;
			flex-direction: column;
			gap: var(--space-5);

			form {
				display: flex;
				flex-direction: column;
				.range-wrapper {
					display: flex;
					flex-direction: column;
					gap: var(--space-2);
					margin-bottom: var(--space-5);
				}
			}
		}

		.right-wrapper {
			overflow: hidden;
		}
	}
</style>
