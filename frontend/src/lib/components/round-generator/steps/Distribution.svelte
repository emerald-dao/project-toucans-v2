<script type="ts">
	import { fade } from 'svelte/transition';
	import { newRoundActiveStep } from '$stores/rounds/RoundSteps';
	import { roundData } from '$stores/rounds/RoundData';
	import Icon from '@iconify/svelte';
	import { Button, InputWrapper, Range } from '@emerald-dao/component-library';
	import roundDistributionSuite from '$lib/validations/roundDistributionSuite';
	import PieChart from '$components/charts/PieChart.svelte';
	import type { SvelteComponent } from 'svelte';
	import StepTitle from '../atoms/StepTitle.svelte';

	let distributionData: [string, number] = ['', 0];

	let distributionAddresses: string[] = $roundData.distributionList.map((x) => x[0]);
	let distributionPercentages: number[] = $roundData.distributionList.map((x) => x[1]);

	let chart: SvelteComponent;

	const handleChange = (input: Event) => {
		if (input.type === 'change') {
			res = roundDistributionSuite(distributionData, 'percentage');
		} else {
			const target = input.target as HTMLInputElement;
			res = roundDistributionSuite(distributionData, target.name);
		}
	};

	const handleSubmit = () => {
		roundDistributionSuite.reset();
		res = roundDistributionSuite.get();

		chart.updateChartData(distributionData[0], distributionData[1]);

		$roundData.distributionList = [...$roundData.distributionList, distributionData];
		distributionData = ['', 0];
	};

	const deleteFromDistributionList = (i: number) => {
		$roundData.distributionList.splice(i, 1);
		$roundData.distributionList = $roundData.distributionList;
	};

	let res = roundDistributionSuite.get();

	const onDistributionListChange = (newList: [string, number][]) => {
		let distributedPercentage = 0;

		for (let index = 1; index < newList.length; index++) {
			distributedPercentage = distributedPercentage + newList[index][1];
		}

		$roundData.distributionList[0][1] = 100 - distributedPercentage;
	};

	$: {
		onDistributionListChange($roundData.distributionList);
	}
</script>

<div class="main-wrapper" in:fade={{ duration: 300}}>
	<div>
		<StepTitle title="Round distribution" stepNumber={3}>
			<p class="xsmall">
				You can optionally set a percentage of this round to be distributed between different
				wallets. Please add all the wallets you want to distribute to with their respective
				percentage.
			</p>
		</StepTitle>
		<div class="secondary-wrapper">
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
							bind:value={distributionData[0]}
							on:input={handleChange}
						/>
					</InputWrapper>
					<div class="range-wrapper">
						<label for="distribution-percentage">Percentage to distribute</label>
						<Range
							bind:value={distributionData[1]}
							max={$roundData.distributionList[0][1]}
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
		</div>
	<div class="button-wrapper">
		<a href="#" class="header-link row-2 align-center" on:click={newRoundActiveStep.decrement}>
			<Icon icon="tabler:arrow-left" />
			Back
		</a>
		<Button
			size="large"
			on:click={newRoundActiveStep.increment}
			state={res.isValid() ? 'active' : 'disabled'}
		>
			Launch round
		</Button>
	</div>
</div>

<style type="scss">
	.main-wrapper {
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		height: 100%;

		p {
			max-width: 60ch;
		}

		.secondary-wrapper {
			display: grid;
			grid-template-columns: 1fr 1fr;
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
		}

		.right-wrapper {
			overflow: hidden;
		}

		.button-wrapper {
			min-width: 100%;
			display: flex;
			justify-content: space-between;
			align-items: center;
			margin-top: var(--space-3);
		}
	}
</style>