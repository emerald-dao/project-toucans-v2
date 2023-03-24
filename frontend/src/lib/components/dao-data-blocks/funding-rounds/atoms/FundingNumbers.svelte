<script lang="ts">
	import type { ECurrencies } from '$lib/types/common/enums';

	export let goal: number | string;
	export let funding: number;
	export let fontSize: string = '1rem';
	export let paymenToken: ECurrencies;
</script>

<div class="main-wrapper" style={`font-size: ${fontSize}`}>
	<span class="funding w-regular">{`$${funding.toLocaleString()}`}</span>
	<span class="goal w-regular">{`/ ${goal.toLocaleString()} ${paymenToken}`}</span>
</div>

<style lang="scss">
	.main-wrapper {
		.funding {
			color: var(--clr-heading-main);
			font-size: 1.1em;
		}

		.goal {
			font-size: 0.7em;
			color: var(--clr-text-off);
		}
	}
</style>
