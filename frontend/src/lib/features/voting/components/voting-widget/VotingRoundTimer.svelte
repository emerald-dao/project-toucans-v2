<script lang="ts">
	import type { RemainingTime, VotingRoundStatus } from './voting-round-status.type';

	export let remainingTime: RemainingTime;
	export let votingStatus: VotingRoundStatus;

	const TITLES: {
		[key in VotingRoundStatus]: string;
	} = {
		upcoming: 'Starts in',
		active: 'Ends in',
		ended: 'Ended'
	};
</script>

<div class="main-wrapper">
	<span class="xsmall w-medium title">{TITLES[votingStatus]}</span>
	<div class="time-boxes-wrapper">
		<div class="date-card">
			<span>{remainingTime.days}</span>
			<span class="xsmall">Days</span>
		</div>
		<div class="date-card">
			<span>{remainingTime.hours}</span>
			<span class="xsmall">Hours</span>
		</div>
		<div class="date-card">
			<span>{remainingTime.minutes}</span>
			<span class="xsmall">Minutes</span>
		</div>
		<div class="date-card">
			<span>{remainingTime.seconds}</span>
			<span class="xsmall">Seconds</span>
		</div>
	</div>
</div>

<style lang="scss">
	.main-wrapper {
		display: flex;
		flex-direction: column;
		gap: var(--space-1);

		.title {
			text-transform: uppercase;
			letter-spacing: 0.09em;
		}

		.time-boxes-wrapper {
			display: flex;
			gap: var(--space-2);
			flex-direction: row;

			.date-card {
				display: flex;
				flex-direction: column;
				border: 1px solid var(--clr-border-primary);
				border-radius: var(--radius-0);
				overflow: hidden;

				span {
					padding: var(--space-2);
					text-align: center;
					background-color: var(--clr-surface-secondary);
				}

				span:nth-child(1) {
					color: var(--clr-heading-main);
					font-size: var(--font-size-4);
					border-bottom: 1px solid var(--clr-border-primary);
					background-color: var(--clr-surface-primary);
				}

				span:nth-child(2) {
					line-height: 0.6;
				}
			}
		}
	}
</style>
