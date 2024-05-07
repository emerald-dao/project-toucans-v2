<script lang="ts">
	import Icon from '@iconify/svelte';
	import * as VotingModeCard from './atoms/index';
	import type { ActionData } from '$lib/types/dao-project/dao-project.interface';

	export let linkedActionId: string;
	export let linkedActionType: string;
	export let daoActions: ActionData[];
	export let completedActionIds: {[actionId: string]: boolean}

	const linkedActionData = daoActions.find((action) => action.id === linkedActionId);
	const actionIsCompleted = completedActionIds[linkedActionId] !== undefined;
</script>

{#if actionIsCompleted}
	<VotingModeCard.Root>
		<VotingModeCard.Content>
			<VotingModeCard.Label>
				<Icon icon="tabler:link" />
				Linked Action
			</VotingModeCard.Label>
			<VotingModeCard.Description>
				The DAO signers voted on this action.
			</VotingModeCard.Description>
		</VotingModeCard.Content>
		<VotingModeCard.Details>
			<VotingModeCard.DetailsTitle>
				{linkedActionType} action
			</VotingModeCard.DetailsTitle>
			<span class="xsmall">
				Result: {completedActionIds[linkedActionType] ? 'Accepted!' : 'Recjected.'}
			</span>
		</VotingModeCard.Details>
	</VotingModeCard.Root>
{:else if linkedActionData}
	<VotingModeCard.Root>
		<VotingModeCard.Content>
			<VotingModeCard.Label>
				<Icon icon="tabler:link" />
				Linked Action
			</VotingModeCard.Label>
			<VotingModeCard.Description>
				The DAO signers are asking members opinion about this action.
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