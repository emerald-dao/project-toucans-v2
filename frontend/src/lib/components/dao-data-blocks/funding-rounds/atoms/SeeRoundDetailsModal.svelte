<script type="ts">
	import type { FundingCycle } from '$lib/types/dao-project/funding-rounds/funding-cycle.interface';
	import Icon from '@iconify/svelte';
	import { Modal, getModal } from '@emerald-dao/component-library';
	import RoundsCard from '../widget/RoundsWidget.svelte';
	import type { ECurrencies } from '$lib/types/common/enums';

	export let round: FundingCycle;
	export let projectToken: string;
	export let paymentToken: ECurrencies;
	// cycleIndex
	export let roundNumber: number;
	export let projectId: string;
	export let activeRound: number | null;

	const handleClick = () => {
		getModal(modalName).open();
	};

	$: modalName = `funding-round-${projectId}-${Number(roundNumber) + 1}`;
</script>

<div class="header-link row align-center" on:click={handleClick} on:keydown>
	<Icon icon="tabler:eye" />
</div>
<Modal background="var(--clr-background-secondary)" id={modalName} overflowVisible={true}>
	<RoundsCard
		{round}
		hasBorder={false}
		title="Funding round data"
		{projectToken}
		{paymentToken}
		{projectId}
		{activeRound}
	/>
</Modal>
