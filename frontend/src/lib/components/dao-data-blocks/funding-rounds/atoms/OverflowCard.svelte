<script lang="ts">
	import IconCircle from '$components/atoms/IconCircle.svelte';
	import HolderClaimModal from '$lib/features/overfund/holder-claim/HolderClaimModal.svelte';
	import type { ECurrencies } from '$lib/types/common/enums';
	import type { FundingCycle } from '$lib/types/dao-project/funding-rounds/funding-cycle.interface';
	import { Button, Currency, TooltipIcon } from '@emerald-dao/component-library';

	export let overflow: number;
	export let round: FundingCycle;
	export let paymentToken: ECurrencies;
	export let projectId: string;
</script>

<div class="row-2 align-center">
	<IconCircle icon="tabler:bell-ringing" />
	<span class="small"> Overfunded </span>
	<TooltipIcon
		tooltip="This funding round has been overfunded. You can claim the overflow amount."
		borderColor="var(--clr-tertiary-main)"
		width={0.7}
	/>
	<!-- <Currency amount={overflow} currency={paymentToken} /> -->
	<HolderClaimModal {projectId} />
</div>

<style lang="scss">
	span {
		color: var(--clr-tertiary-main);
	}
</style>
