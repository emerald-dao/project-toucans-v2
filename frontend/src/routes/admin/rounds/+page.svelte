<script type="ts">
	import type { DAOProject } from '$lib/types/dao-project/dao-project.interface';
	import { getContext } from 'svelte';
	import RoundDetail from '$lib/components/atoms/RoundDetail.svelte';
	import type { Writable } from 'svelte/store';
	import RoundGeneratorModal from '$lib/features/round-generator/components/RoundGeneratorModal.svelte';

	const adminData: {
		activeDao: Writable<number>;
		userDaos: DAOProject[];
	} = getContext('admin-data');

	const activeDaoStore = adminData.activeDao;

	$: activeDaoData = adminData.userDaos[$activeDaoStore];
</script>

<div class="card column-space-between">
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
		<RoundGeneratorModal daoData={activeDaoData} />
	</div>
</div>

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
