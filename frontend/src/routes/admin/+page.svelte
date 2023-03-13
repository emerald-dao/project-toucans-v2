<script lang="ts">
	import type { DAOProject } from '$lib/types/dao-project/dao-project.interface';
	import { getContext } from 'svelte';
	import type { Writable } from 'svelte/store';
	import {
		PrimaryTabs,
		SecondaryTabs,
		GeneralStats,
		Signers,
		TreasuryWallet,
		DaoStatsIntro
	} from './_components';

	const adminData: {
		activeDao: Writable<number>;
		userDaos: DAOProject[];
	} = getContext('admin-data');

	const activeDaoStore = adminData.activeDao;

	$: activeDaoData = adminData.userDaos[$activeDaoStore];
</script>

<div class="main-wrapper column-5">
	<DaoStatsIntro daoData={activeDaoData} />
	<div class="secondary-wrapper">
		<div class="column-8">
			<GeneralStats daoData={activeDaoData} />
			<PrimaryTabs daoData={activeDaoData} />
		</div>
		<div class="column-space-between second-column">
			<div class="column-6">
				<TreasuryWallet daoData={activeDaoData} />
				<SecondaryTabs daoData={activeDaoData} />
			</div>
			<Signers daoData={activeDaoData} />
		</div>
	</div>
</div>

<style lang="scss">
	.main-wrapper {
		flex: 1;

		.secondary-wrapper {
			display: grid;
			grid-template-columns: 3fr 2fr;
			gap: var(--space-13);
			height: 100%;

			.second-column {
				display: flex;
				height: 100%;
			}
		}
	}
</style>
