<script type="ts">
	import VotingGeneratorModal from './_components/VotingGeneratorModal.svelte';
	import type { DAOProject } from '$lib/types/dao-project/dao-project.interface';
	import * as AdminPage from '../_components/admin-page';
	import VotingRoundsGrid from '$lib/features/voting-rounds/components/voting-round-card/VotingRoundsGrid.svelte';

	export let data;

	let activeDao = data.activeDao as DAOProject;
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
					daoSigners={activeDao.onChainData.signers}
					showDeleteButton={true}
				/>
			</div>
			<VotingGeneratorModal daoData={activeDao} />
		</AdminPage.Content>
	</AdminPage.Container>
</AdminPage.Root>

<style lang="scss">
	.grid-wrapper {
		display: flex;
		flex: 1;
	}
</style>
