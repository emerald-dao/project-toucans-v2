<script type="ts">
	import { newRoundSteps, newRoundActiveStep } from '$lib/stores/rounds/RoundSteps';
	import Icon from '@iconify/svelte';
	import type { CommunityDao, FinancialDao } from '$lib/types/dao-project.interface';
	import { Button } from '@emerald-dao/component-library';
	import { getContext } from 'svelte';
	import RoundDetail from '$lib/components/atoms/RoundDetail.svelte';
	import { Modal, getModal } from '@emerald-dao/component-library';
	import type { Writable } from 'svelte/store';

	const adminData: {
		activeDao: Writable<number>;
		userDaos: FinancialDao[] | CommunityDao[];
	} = getContext('admin-data');

	const activeDaoStore = adminData.activeDao;

	$: activeDaoData = adminData.userDaos[$activeDaoStore] as FinancialDao;
</script>

<div class="card column-3">
	<div class="rounds-wrapper">
		{#if !activeDaoData.fundingCycles}
			<span>This project has no funding rounds yet</span>
		{:else}
			{#each activeDaoData.fundingCycles as round, i}
				<RoundDetail {round} {i} />
			{/each}
		{/if}
	</div>
	<div class="create-round-wrapper">
		<Button on:click={() => getModal().open()} width="extended"
			><Icon icon="tabler:plus" />Create Round</Button
		>
	</div>
</div>
<Modal>
	<div class="column-4 align-end">
		<svelte:component this={$newRoundSteps[$newRoundActiveStep].component} />
	</div>
</Modal>

<style type="scss">
	.card {
		padding: var(--space-12);

		.rounds-wrapper {
			display: flex;
			flex-direction: column;
			gap: 1.2rem;
		}
		.rounds-wrapper:not(:last-child) {
			margin-bottom: 2rem;
		}

		.create-round-wrapper {
			display: none;

			@include mq('medium') {
				display: flex;
				justify-content: flex-end;
				width: 100%;
			}
		}
	}
</style>
