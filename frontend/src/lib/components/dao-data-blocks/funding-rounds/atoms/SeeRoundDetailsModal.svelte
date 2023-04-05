<script type="ts">
	import type { FundingCycle } from '$lib/types/dao-project/funding-rounds/funding-cycle.interface';
	import Icon from '@iconify/svelte';
	import { Modal, getModal } from '@emerald-dao/component-library';
	import RoundCard from '../RoundsCard.svelte';
	import type { ECurrencies } from '$lib/types/common/enums';

	export let round: FundingCycle;
	export let projectToken: string;
	export let paymentToken: ECurrencies;
	export let roundNumber: number;
	export let projectId: string;
</script>

<div
	class="header-link row align-center"
	on:click={() => getModal(`funding-stats-${roundNumber}`).open()}
	on:keydown
>
	<Icon icon="tabler:eye" />
</div>
<Modal background="var(--clr-background-secondary)" id={`funding-stats-${roundNumber}`}>
	<RoundCard
		{round}
		hasBorder={false}
		title="Funding round data"
		{projectToken}
		{paymentToken}
		{projectId}
	/>
</Modal>
