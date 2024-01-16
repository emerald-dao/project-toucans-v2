<script lang="ts">
	import type { DAOProject } from '$lib/types/dao-project/dao-project.interface';
	import { Currency, ProgressBar, TooltipIcon } from '@emerald-dao/component-library';

	export let daoData: DAOProject;

	interface HoldingData {
		numHolders: number;
		averageHolding: number;
	}

	interface FundingData {
		numFunders: number;
		averageFunding: number;
	}

	async function calculateFundingData(): Promise<FundingData> {
		const lpAddresses = Object.values(daoData.onChainData.lpAddresses);

		let numFunders;

		numFunders = 0;

		for (const funder in daoData.funding.funders) {
			numFunders++;
		}

		let averageFunding = daoData.funding.total_funding / numFunders;

		isNaN(averageFunding) ? (averageFunding = 0) : null;

		return { numFunders, averageFunding };
	}

	async function calculateHoldingData(): Promise<HoldingData> {
		const lpAddresses = Object.values(daoData.onChainData.lpAddresses);

		let numHolders, totalHolding;

		numHolders = totalHolding = 0;

		for (const holder in daoData.onChainData.balances) {
			if (holder === daoData.generalInfo.owner || lpAddresses.includes(holder)) continue;
			numHolders++;
			totalHolding += Number(daoData.onChainData.balances[holder]);
		}

		let averageHolding = totalHolding / numHolders ?? 0;

		isNaN(averageHolding) ? (averageHolding = 0) : null;

		return { numHolders, averageHolding };
	}
</script>

<div class="card column-5 align-start">
	<div class="secondary-wrapper">
		{#if daoData.generalInfo.token_symbol}
			<div class="supply-wrapper">
				<div class="column-1 align-start">
					<div class="row-2 align-center">
						<p class="xsmall">Total Supply</p>
						<div class="tooltip-mobile-display">
							<TooltipIcon width={0.6} tooltip="The total amount of minted tokens." />
						</div>
					</div>
					<Currency
						amount={daoData.onChainData.totalSupply}
						currency={daoData.generalInfo.token_symbol}
						color="heading"
						fontSize="var(--font-size-3)"
					/>
				</div>
				<div class="column-1 align-start">
					<div class="row-2 align-center">
						<p class="xsmall">Max Supply</p>
						<div class="tooltip-mobile-display">
							<TooltipIcon
								width={0.6}
								tooltip="The maximum # of tokens allowed. Please note that the project owner could edit this if they wish."
							/>
						</div>
					</div>
					{#if daoData.onChainData.maxSupply}
						<Currency
							amount={daoData.onChainData.maxSupply}
							currency={daoData.generalInfo.token_symbol}
							color="heading"
							fontSize="var(--font-size-3)"
						/>
					{:else}
						<p class="unlimited">∞</p>
					{/if}
				</div>
			</div>
		{/if}
		{#if daoData.onChainData.maxSupply}
			<ProgressBar
				labelText="Circulating ratio"
				max={Number(daoData.onChainData.maxSupply)}
				value={Number(daoData.onChainData.totalSupply)}
				showPercentage={true}
			/>
		{/if}
	</div>
	<div class="tertiary-wrapper">
		{#if daoData.generalInfo.token_symbol}
			{#await calculateHoldingData() then tokenData}
				<div>
					<p class="xsmall">Unique Holders</p>
					<Currency amount={tokenData.numHolders} color="heading" fontSize="var(--font-size-1)" />
				</div>
				<div>
					<p class="xsmall">Average Holding</p>
					<Currency
						amount={tokenData.averageHolding}
						color="heading"
						currency={daoData.generalInfo.token_symbol}
						fontSize="var(--font-size-1)"
					/>
				</div>
			{/await}
			{#await calculateFundingData() then tokenData}
				<div>
					<p class="xsmall">Unique Funders</p>
					<Currency amount={tokenData.numFunders} color="heading" fontSize="var(--font-size-1)" />
				</div>
				<div>
					<p class="xsmall">Average Funding</p>
					<Currency
						amount={tokenData.averageFunding}
						color="heading"
						moneyPrefix={true}
						decimalNumbers={2}
						fontSize="var(--font-size-1)"
					/>
				</div>
			{/await}
		{/if}
	</div>
</div>

<style lang="scss">
	.tooltip-mobile-display {
		display: none;
		@include mq('small') {
			display: block;
		}
	}

	.card {
		padding: 0;
		flex: 1;

		.secondary-wrapper {
			display: flex;
			flex-direction: column;
			gap: var(--space-4);
			border-bottom: 0.5px solid var(--clr-border-primary);
			padding-bottom: var(--space-7);
			width: 100%;
			padding-top: var(--space-6);

			.unlimited {
				color: var(--clr-heading-main);
				font-size: var(--font-size-3);
			}
		}

		.tertiary-wrapper {
			width: 100%;
			padding-bottom: var(--space-6);
			display: grid;
			grid-template-columns: 1fr 1fr;
			gap: var(--space-3);

			p {
				color: var(--clr-text-off);
			}
		}

		.supply-wrapper {
			display: grid;
			grid-template-columns: 1fr 1fr;
			gap: var(--space-3);
		}

		.tertiary-wrapper,
		.secondary-wrapper {
			padding-inline: var(--space-7);
		}
	}
</style>
