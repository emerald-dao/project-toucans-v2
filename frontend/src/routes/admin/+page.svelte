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
	import NftsCard from '../../lib/components/cards/NftsCard.svelte';
	import { getProjectNFTTreasury } from '$flow/actions';

	const adminData: {
		activeDao: Writable<number>;
		userDaos: Writable<DAOProject[]>;
	} = getContext('admin-data');

	const activeDaoStore = adminData.activeDao;
	const userDaosStore = adminData.userDaos;

	$: activeDaoData = $userDaosStore[$activeDaoStore];
</script>

<div class="main-wrapper column-5" in:fly={{ x: 10, duration: 400 }}>
	<DaoStatsIntro daoData={activeDaoData} />
	<div class="secondary-wrapper">
		<div class="column-8">
			<GeneralStats daoData={activeDaoData} />
			{#await getProjectNFTTreasury(activeDaoData.generalInfo.owner, activeDaoData.generalInfo.project_id) then NFTs}
				{#if Object.keys(NFTs).length > 0}
					<NftsCard {NFTs} />
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

				a {
					text-decoration: none;
				}
			}
		}
	}
</style>
