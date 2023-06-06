<script lang="ts">
	import Icon from '@iconify/svelte';

	export let variation: number;

	const VARIATION_COFIGS = {
		positive: {
			class: 'positive',
			icon: 'tabler:arrow-up'
		},
		negative: {
			class: 'negative',
			icon: 'tabler:arrow-down'
		},
		zero: {
			class: 'zero',
			icon: ''
		}
	};

	$: variationConfig =
		variation > 0
			? VARIATION_COFIGS.positive
			: variation < 0
			? VARIATION_COFIGS.negative
			: VARIATION_COFIGS.zero;
</script>

<span class={`${variationConfig.class} small`}>
	<Icon icon={variationConfig.icon} />
	{variation}%
</span>

<style lang="scss">
	span {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;

		&.positive {
			color: var(--clr-primary-main);
		}

		&.negative {
			color: var(--clr-alert-main);
		}

		&.zero {
			color: var(--clr-text-main);
		}
	}
</style>
