<script lang="ts">
	import type { Vote } from '$lib/types/dao-project/bot-votes/votes.interface';
	import { ProgressBar } from '@emerald-dao/component-library';

	export let votingData: Vote;
	export let size: 'x-small' | 'small' | 'medium' | 'large' = 'small';

	$: fontSize =
		size === 'x-small'
			? '0.8rem'
			: size === 'small'
			? '1rem'
			: size === 'medium'
			? '1.1rem'
			: '1.2rem';

	$: verticalLineHeight =
		size === 'x-small'
			? '1.1rem'
			: size === 'small'
			? '1.8rem'
			: size === 'medium'
			? '2.2em'
			: '2.8rem';
</script>

<div style={`font-size: ${fontSize}`}>
	<div class="row-space-between">
		<span class="success">{votingData.for_total} votes</span>
		<span class="alert right">{votingData.against_total} votes</span>
	</div>
	<ProgressBar
		value={votingData.for_total}
		max={votingData.for_total + votingData.against_total}
		verticalLine={(votingData.for_total + votingData.against_total) / 2}
		{verticalLineHeight}
		backgroundColor="var(--clr-alert-main)"
		{size}
	/>
</div>

<style lang="scss">
	.success {
		color: var(--clr-primary-main);
	}

	.alert {
		color: var(--clr-alert-main);
	}

	span {
		font-size: 0.7em;
		line-height: 1.2em;
	}

	.right {
		text-align: right;
	}
</style>
