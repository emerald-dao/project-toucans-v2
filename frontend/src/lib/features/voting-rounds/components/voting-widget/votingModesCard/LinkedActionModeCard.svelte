<script lang="ts">
	import Icon from '@iconify/svelte';
	import * as VotingModeCard from './atoms/index';
	import type { ActionData } from '$lib/types/dao-project/dao-project.interface';

	export let linkedActionId: string;
	export let daoActions: ActionData[];

	const linkedActionData = daoActions.find((action) => action.id === linkedActionId);
</script>

{#if linkedActionData}
	<VotingModeCard.Root>
		<VotingModeCard.Content>
			<VotingModeCard.Label>
				<Icon icon="tabler:link" />
				Linked Action
			</VotingModeCard.Label>
			<VotingModeCard.Description>
				Signers are asking members opinion about this action.
			</VotingModeCard.Description>
		</VotingModeCard.Content>
		<VotingModeCard.Details>
			<VotingModeCard.DetailsTitle>
				{linkedActionData.title} action
			</VotingModeCard.DetailsTitle>
			<span class="xsmall">
				{linkedActionData.intent}
			</span>
		</VotingModeCard.Details>
	</VotingModeCard.Root>
{/if}
