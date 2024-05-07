<script type="ts">
	import type { ECurrencies } from '$lib/types/common/enums';

	export let paymentCurrency: ECurrencies | 'NFTs';
</script>

<p class="xsmall">
	<i>
		2% of the transferred ${paymentCurrency} will go to the Emerald City treasury to help support the
		platform and its developers.
	</i>
</p>

<style type="scss">
	p {
		padding: 0.5rem;
	}
</style>
