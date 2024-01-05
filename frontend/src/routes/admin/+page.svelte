<script lang="ts">
	import { fly } from 'svelte/transition';
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
	import NftsTreasuryWidget from '../p/[projectId]/_components/sections/widgets/NftsTreasuryWidget.svelte';
	import { getProjectNFTTreasury } from '$flow/actions';
	import * as AdminPage from './_components/admin-page';

	const adminData: {
		activeDao: Writable<number>;
		userDaos: Writable<DAOProject[]>;
	} = getContext('admin-data');

	const activeDaoStore = adminData.activeDao;
	const userDaosStore = adminData.userDaos;

	$: activeDaoData = $userDaosStore[$activeDaoStore];
</script>

<AdminPage.Root>
	<DaoStatsIntro daoData={activeDaoData} />
	<div class="secondary-wrapper">
		<div class="column-8">
			<GeneralStats daoData={activeDaoData} />
			{#await getProjectNFTTreasury(activeDaoData.generalInfo.owner, activeDaoData.generalInfo.project_id) then NFTs}
				{#if Object.keys(NFTs).length > 0}
					<NftsTreasuryWidget {NFTs} pageSize={4} />
				{/if}
			{/await}
			<PrimaryTabs daoData={activeDaoData} />
		</div>
		<div class="column-space-between second-column">
			<div class="column-6">
				<a href="/admin/withdraw">
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

		.second-column {
			display: flex;

			a {
				text-decoration: none;
			}
		}
	}
</style>
