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

	const handleChange = (input: Event) => {
		if (input.type === 'change') {
			res = roundDistributionSuite(distributionData, 'percentage');
		} else {
			const target = input.target as HTMLInputElement;
			res = roundDistributionSuite(distributionData, target.name);
		}
	};

	const handleSubmit = () => {
		distributionList = [...distributionList, distributionData];
		distributionData = {
			address: '',
			percentage: 0
		};

		roundDistributionSuite.reset();
		res = roundDistributionSuite.get();
	};

	const deleteFromDistributionList = (i: number) => {
		distributionList.splice(i, 1);
		distributionList = distributionList;
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

<div class="main-wrapper">
	<span>Distribution</span>
	<div class="secondary-wrapper">
		<div class="left-wrapper">
			<p class="xsmall">
				You can optionally set a percentage of this round to be distributed between different
				wallets. Please add all the wallets you want to distribute to with their respective
				percentage
			</p>
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
				<div class="range-wrapper">
					<label for="distribution-percentage">Percentage to distribute</label>
					<Range
						bind:value={distributionData.percentage}
						max={distributionList[0].percentage}
						suffix="%"
						id="distribution-percentage"
						on:change={handleChange}
						--clr-surface-secondary="var(--clr-surface-primary)"
					/>
				</div>
				<Button
					size="full-width"
					type="ghost"
					color="neutral"
					on:click={handleSubmit}
					state={res.isValid() ? 'active' : 'disabled'}><Icon icon="tabler:plus" /> Add</Button
				>
			</form>
		</div>
		<div class="right-wrapper">
			{#each distributionList as distrbutionData, i}
				<DistributionElement
					address={distrbutionData.address}
					percentage={distrbutionData.percentage}
					canDelete={i > 0}
					on:delete={() => deleteFromDistributionList(i)}
					{i}
				/>
			{/each}
			<div />
		</div>
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

		span {
			color: var(--clr-heading-main);
		}
	}
</style>
