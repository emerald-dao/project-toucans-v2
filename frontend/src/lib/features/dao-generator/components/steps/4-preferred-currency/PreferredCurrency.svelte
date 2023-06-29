<script type="ts">
	import CurrencySelect from '$lib/components/atoms/CurrencySelect.svelte';
	import { fly } from 'svelte/transition';
	import StepButtons from '../../atoms/StepButtons.svelte';
	import { ECurrencies } from '$lib/types/common/enums';
	import { TooltipIcon } from '@emerald-dao/component-library';
	import GLOSSARY from '$lib/config/glossary';
	import { getContext } from 'svelte';
	import type { daoGeneratorData as IDaoGeneratorData } from '$lib/features/dao-generator/stores/DaoGeneratorData';

	const daoGeneratorData: typeof IDaoGeneratorData = getContext('daoGeneratorData');
</script>

<form in:fly={{ y: 30, duration: 400 }} class="column-2" autocomplete="off">
	<div class="payment-currency column-2">
		<div class="row-2 align-center">
			<label for="currencies">Preferred currency</label>
			<TooltipIcon tooltip={GLOSSARY.preferredCurrnecy} width={0.75} />
		</div>
		<CurrencySelect
			currencies={[ECurrencies.FLOW, ECurrencies.USDC]}
			bind:value={$daoGeneratorData.tokenomics.paymentCurrency}
		/>
	</div>
	<StepButtons />
</form>

<style lange="scss">
	.payment-currency {
		margin: var(--space-5) 0;
	}
</style>
