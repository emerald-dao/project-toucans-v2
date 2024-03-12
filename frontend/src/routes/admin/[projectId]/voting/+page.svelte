<script type="ts">
	import VotingGeneratorModal from './_components/VotingGeneratorModal.svelte';
	import type { DAOProject, DaoDatabaseData } from '$lib/types/dao-project/dao-project.interface';
	import { getContext } from 'svelte';
	import type { Writable } from 'svelte/store';
	import * as AdminPage from '../_components/admin-page';
	import VotingRoundsGrid from '$lib/features/voting-rounds/components/voting-round-card/VotingRoundsGrid.svelte';

	export let data;

	const adminData: {
		activeDao: Writable<DAOProject>;
		otherDaos: DaoDatabaseData[];
	} = getContext('admin-data');

	const activeDaoStore = adminData.activeDao;
	$: activeDaoData = $activeDaoStore;
</script>

<AdminPage.Root>
	<AdminPage.Header>
		<AdminPage.Title>Voting Rounds</AdminPage.Title>
	</AdminPage.Header>
	<AdminPage.Container grid={false}>
		<AdminPage.Content>
			<div class="grid-wrapper">
				<VotingRoundsGrid
					votingRounds={data.votingRounds}
					cardsPerPage={3}
					daoSigners={activeDaoData.onChainData.signers}
				/>
			</div>
			<VotingGeneratorModal daoData={activeDaoData} />
		</AdminPage.Content>
	</AdminPage.Container>
</AdminPage.Root>

<style lang="scss">
	.grid-wrapper {
		display: flex;
		flex: 1;
	}
</style>
