<script type="ts">
	import { newRoundActiveStep } from '$stores/rounds/RoundSteps';
	import Icon from '@iconify/svelte';
	import { Button, InputWrapper, Range } from '@emerald-dao/component-library';
	import roundDistributionSuite from '$lib/validations/roundDistributionSuite';
	import PieChart from '$components/charts/PieChart.svelte';
	import type { SvelteComponent } from 'svelte';

	let distributionList: [string, number][] = [['Treasury Wallet', 100]];
	let distributionData: [string, number] = ['', 0];

	let distributionAddresses: string[] = distributionList.map((x) => x[0]);
	let distributionPercentages: number[] = distributionList.map((x) => x[1]);

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

		distributionList = [...distributionList, distributionData];
		distributionData = ['', 0];
	};

	const deleteFromDistributionList = (i: number) => {
		distributionList.splice(i, 1);
		distributionList = distributionList;
	};

	let res = roundDistributionSuite.get();

	const onDistributionListChange = (newList: [string, number][]) => {
		let distributedPercentage = 0;

		for (let index = 1; index < newList.length; index++) {
			distributedPercentage = distributedPercentage + newList[index][1];
		}

		distributionList[0][1] = 100 - distributedPercentage;
	};

	$: {
		onDistributionListChange(distributionList);
	}
</script>

<div class="main-wrapper">
	<span>Distribution</span>
	<div class="secondary-wrapper">
		<div class="left-wrapper">
			<p class="xsmall">
				You can optionally set a percentage of this round to be distributed between different
				wallets. Please add all the wallets you want to distribute to with their respective
				percentage.
			</p>
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
						max={distributionList[0][1]}
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
	<div class="button-wrapper">
		<Button on:click={newRoundActiveStep.increment} width="extended">Distribute</Button>
	</div>
</div>

<style type="scss">
	.main-wrapper {
		max-width: 800px;
		overflow: hidden;

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
			width: 100%;
			display: flex;
			justify-content: flex-end;
			margin-top: var(--space-3);
		}

		span {
			color: var(--clr-heading-main);
			margin-bottom: var(--space-2);
		}
	}
</style>
