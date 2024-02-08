<script lang="ts">
	export let title: string;
	export let days: number;
	export let hours: number;
	export let minutes: number;
	export let seconds: number;
</script>

<div class="main-wrapper">
	<span class="xsmall w-medium title">{title}</span>
	<div class="time-boxes-wrapper">
		<div class="date-card">
			<span>{days}</span>
			<span class="xsmall">Days</span>
		</div>
		<div class="date-card">
			<span>{hours}</span>
			<span class="xsmall">Hours</span>
		</div>
		<div class="date-card">
			<span>{minutes}</span>
			<span class="xsmall">Minutes</span>
		</div>
		<div class="date-card">
			<span>{seconds}</span>
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
