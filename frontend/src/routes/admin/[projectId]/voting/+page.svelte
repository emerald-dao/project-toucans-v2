<script type="ts">
	import VotingGeneratorModal from './_components/VotingGeneratorModal.svelte';
	import type { DAOProject, DaoDatabaseData } from '$lib/types/dao-project/dao-project.interface';
	import { getContext } from 'svelte';
	import type { Writable } from 'svelte/store';
	import * as AdminPage from '../_components/admin-page';
	import { VOTING_ROUNDS_MOCK } from './_mock-data/VOTING_ROUNDS_MOCK';
	import VotingsWidget from '../../../p/[projectId]/_components/sections/widgets/VotingsWidget.svelte';

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
			<VotingsWidget votingData={VOTING_ROUNDS_MOCK} />
			<VotingGeneratorModal daoData={activeDaoData} />
		</AdminPage.Content>
	</AdminPage.Container>
</AdminPage.Root>
