<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import VotingWidgetExpanded from '$lib/features/voting-rounds/components/voting-widget/VotingWidgetExpanded.svelte';
	import { Button } from '@emerald-dao/component-library';
	import Icon from '@iconify/svelte';

	export let data;

	$: roundData = data.votingRounds.find((round) => round.id === Number($page.params.votingRoundId));
	$: roundIndex = data.votingRounds.findIndex(
		(round) => round.id === Number($page.params.votingRoundId)
	);

	$: nextVotingRoundId = data.votingRounds[roundIndex + 1]?.id;
	$: previousVotingRoundId = data.votingRounds[roundIndex - 1]?.id;
</script>

{#if roundData}
	<div class="main-wrapper" id={`${roundData.id}`}>
		{#key roundData.id}
			<VotingWidgetExpanded
				votingRound={roundData}
				daoActions={data.onChainData.actions} 
				completedActionIds={data.onChainData.completedActionIds}
				tokenContractAddress={data.generalInfo.contract_address}
			/>
		{/key}
		<div class="row-3 row-space-between">
			<Button
				on:click={() => goto(`/p/${$page.params.projectId}/voting-rounds/${previousVotingRoundId}`)}
				color="neutral"
				type="ghost"
				size="x-small"
				state={roundIndex === 0 ? 'disabled' : 'active'}
			>
				<Icon icon="tabler:arrow-left" />
				Previous round
			</Button>
			<Button
				on:click={() => goto(`/p/${$page.params.projectId}/voting-rounds/${nextVotingRoundId}`)}
				color="neutral"
				type="ghost"
				size="x-small"
				state={roundIndex === data.votingRounds.length - 1 ? 'disabled' : 'active'}
			>
				Next round
				<Icon icon="tabler:arrow-right" />
			</Button>
		</div>
	</div>
{:else}
	<em>We couldn't find the indicated voting round</em>
{/if}

<style lang="scss">
	.main-wrapper {
		display: flex;
		flex: 1;
		flex-direction: column;
		justify-content: space-between;
		gap: var(--space-12);
	}
</style>
