<script type="ts">
	import Icon from '@iconify/svelte';
	import { Currencies } from '$lib/types/currencies.enum';
	import type { Round } from '$lib/types/dao-project.interface';
	import { daysOfDifference, formatDate } from '$lib/utilities/formatDate';
	import {
		Button,
		Label,
		Modal,
		getModal,
		ProgressBar,
		StatusCircle
	} from '@emerald-dao/component-library';
	import FundingStats from '$components/atoms/FundingStats.svelte';

	export let round: Round;
	export let discover: boolean = false;
	export let i: number;

	console.log('round', round);

	console.log(formatDate(new Date(Number(round.details.timeFrame.startTime))));
	console.log(formatDate(new Date(Number(round.details.timeFrame.startTime))));

	const goalReached = round.details.fundingTarget < round.numOfFlowContributed;
	const active = new Date(Number(round.details.timeFrame.startTime)) > new Date();
</script>

<div class="main-wrapper">
	<div class="row-9 align-center">
		<div class="row-4 align-center">
			<StatusCircle width="0.5rem" status={active ? 'active' : goalReached ? 'success' : 'alert'} />
			<div class="progress-bar-wrapper">
				<ProgressBar
					value={Number(round.numOfFlowContributed)}
					max={Number(round.details.fundingTarget)}
					labelText={`$${Number(round.numOfFlowContributed).toLocaleString()} ${
						Currencies.FLOW
					} raised from $${Number(round.details.fundingTarget).toLocaleString()} goal`}
					size="x-small"
				/>
			</div>
		</div>
		<span class="xsmall display-handling"
			>{`${formatDate(new Date(Number(round.details.timeFrame.startTime)))} to ${formatDate(
				new Date(Number(round.details.timeFrame.endTime))
			)}`}</span
		>
	</div>
	<div class="row-5 display-handling">
		{#if active}
			<Label color="transparent" iconLeft="tabler:clock-hour-5" size="x-small">
				{`${-daysOfDifference(
					new Date(),
					new Date(Number(round.details.timeFrame.endTime))
				)} days left`}
			</Label>
		{:else}
			<div class="row-2 buttons-wrapper" class:page={discover}>
				<Button
					size="x-small"
					type="ghost"
					color="neutral"
					state={round.distributed ? 'disabled' : 'active'}>Distribute reserve</Button
				>
				<Button
					size="x-small"
					type="ghost"
					color="neutral"
					state={round.withdrawn ? 'disabled' : 'active'}
				>
					Withdraw to treasury
				</Button>
			</div>
		{/if}
		<div class="header-link" on:click={() => getModal(`funding-stats-${i}`).open()} on:keydown>
			<Icon icon="tabler:eye" />
		</div>
	</div>
</div>
<Modal background="var(--clr-background-secondary)" id={`funding-stats-${i}`}>
	<FundingStats fundingCycleData={round} hasBorder={false} title="Funding round data" />
</Modal>

<style type="scss">
	.main-wrapper {
		display: grid;
		grid-template-columns: 1fr auto;
		padding: var(--space-3) 0;
		border-bottom: 1px var(--clr-border-primary) solid;
		width: 100%;
		gap: 2rem;

		.progress-bar-wrapper {
			width: 100%;
		}

		.display-handling {
			display: none;

			@include mq('medium') {
				display: block;
			}
		}

		.buttons-wrapper.page {
			display: none;
		}
	}
</style>
