<script lang="ts">
	import {
		PrimaryTabs,
		SecondaryTabs,
		GeneralStats,
		Signers,
		TreasuryWallet,
		DaoStatsIntro
	} from './_components';
	import * as AdminPage from './_components/admin-page';

	export let data;
</script>

{#if data.activeDao}
	<AdminPage.Root>
		<DaoStatsIntro daoData={data.activeDao} />
		<div class="secondary-wrapper">
			<div class="column-8">
				<GeneralStats daoData={data.activeDao} />
				<PrimaryTabs daoData={data.activeDao} />
			</div>
			<div class="column-space-between second-column">
				<div class="treasury-wrapper column-6">
					<a href={`/admin/${data.activeDao.generalInfo.project_id}/withdraw`}>
						<TreasuryWallet daoData={data.activeDao} />
					</a>
					<SecondaryTabs daoData={data.activeDao} />
				</div>
				<Signers daoData={data.activeDao} />
			</div>
		</div>
	</AdminPage.Root>
{/if}

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
