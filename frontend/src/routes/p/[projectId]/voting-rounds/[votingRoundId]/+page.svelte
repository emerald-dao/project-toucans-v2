<script lang="ts">
	import { fly } from 'svelte/transition';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { Button } from '@emerald-dao/component-library';
	import VotingWidget from './_components/voting-widget/VotingWidget.svelte';
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
	<div class="main-wrapper" in:fly={{ duration: 200, y: 20 }} id={`${roundData.id}`}>
		<VotingWidget votingRound={data.votingRounds[roundIndex]} />
		<div class="row-3 row-space-between">
			<Button
				on:click={() => goto(`/p/${$page.params.projectId}/voting-rounds/${previousVotingRoundId}`)}
				color="neutral"
				type="ghost"
				state={roundIndex === 0 ? 'disabled' : 'active'}
			>
				<Icon icon="tabler:arrow-left" />
				Previous round
			</Button>
			<Button
				on:click={() => goto(`/p/${$page.params.projectId}/voting-rounds/${nextVotingRoundId}`)}
				color="neutral"
				type="ghost"
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
