<script lang="ts">
	import type { DAOProject, DaoDatabaseData } from '$lib/types/dao-project/dao-project.interface';
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
	import * as AdminPage from './_components/admin-page';

	const adminData: {
		activeDao: Writable<DAOProject>;
		otherDaos: DaoDatabaseData[];
	} = getContext('admin-data');

	const activeDaoStore = adminData.activeDao;
	$: activeDaoData = $activeDaoStore;
</script>

<AdminPage.Root>
	<DaoStatsIntro daoData={activeDaoData} />
	<div class="secondary-wrapper">
		<div class="column-8">
			<GeneralStats daoData={activeDaoData} />
			<PrimaryTabs daoData={activeDaoData} />
		</div>
		<div class="column-space-between second-column">
			<div class="treasury-wrapper column-6">
				<a href={`/admin/${activeDaoData.generalInfo.project_id}/withdraw`}>
					<TreasuryWallet daoData={activeDaoData} />
				</a>
				<SecondaryTabs daoData={activeDaoData} />
			</div>
			<Signers daoData={activeDaoData} />
		</div>
	</div>
</AdminPage.Root>

<style lang="scss">
	.secondary-wrapper {
		display: grid;
		grid-template-columns: 3fr 2fr;
		gap: var(--space-13);
		flex: 1;

		.second-column {
			display: flex;
			flex: 1;

			.treasury-wrapper {
				flex: 1;
			}

			a {
				text-decoration: none;
			}
		}
	}
</style>
