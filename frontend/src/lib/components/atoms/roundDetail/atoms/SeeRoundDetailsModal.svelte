<script type="ts">
	import type { FundingCycle } from '$lib/types/dao-project/funding-rounds/funding-cycle.interface';
	import Icon from '@iconify/svelte';
	import { Modal, getModal } from '@emerald-dao/component-library';
	import FundingStats from '$components/atoms/FundingStats.svelte';

	export let round: FundingCycle;
	export let projectToken: string;
	export let i: number;
</script>

<div
	class="header-link row align-center"
	on:click={() => getModal(`funding-stats-${i}`).open()}
	on:keydown
>
	<Icon icon="tabler:eye" />
</div>
<Modal background="var(--clr-background-secondary)" id={`funding-stats-${i}`}>
	<FundingStats {round} hasBorder={false} title="Funding round data" {projectToken} />
</Modal>
