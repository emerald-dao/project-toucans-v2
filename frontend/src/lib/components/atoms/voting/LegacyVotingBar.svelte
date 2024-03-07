<script lang="ts">
	import { ProgressBar } from '@emerald-dao/component-library';

	export let forVotes: number;
	export let againstVotes: number;
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
		<span class="success">{forVotes} votes</span>
		<span class="alert right">{againstVotes} votes</span>
	</div>
	<ProgressBar
		value={forVotes}
		max={forVotes + againstVotes}
		verticalLine={(forVotes + againstVotes) / 2}
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
